import { useEffect, useMemo, useRef, useState } from "react";
import { geminiGenerateSections } from "../services/gemini";
import type { AiStructuredResponse } from "../types/ai";

type ChatMsg =
  | { role: "user"; text: string; at: number }
  | { role: "ai"; data: AiStructuredResponse; at: number }
  | { role: "ai_error"; text: string; at: number };

function isAbortError(e: unknown) {
  return (e as any)?.name === "AbortError";
}

function now() {
  return Date.now();
}

export default function FloatingAiWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [msgs, setMsgs] = useState<ChatMsg[]>(() => []);

  const acRef = useRef<AbortController | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const canSend = useMemo(
    () => input.trim().length > 0 && !loading,
    [input, loading]
  );

  useEffect(() => {
    if (!open) return;
    // scroll to bottom when opened
    queueMicrotask(() => {
      listRef.current?.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, [open]);

  useEffect(() => {
    // scroll when new message arrives
    queueMicrotask(() => {
      listRef.current?.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  }, [msgs.length]);

  async function send() {
    const q = input.trim();
    if (!q || loading) return;

    setInput("");
    setMsgs((prev) => [...prev, { role: "user", text: q, at: now() }]);

    acRef.current?.abort();
    const ac = new AbortController();
    acRef.current = ac;

    setLoading(true);
    try {
      const data = await geminiGenerateSections({
        userMessage: q,
        locale: "vi",
        context: {
          page: "floating-widget",
          userGoal: "Trả lời theo từng section để dễ đọc",
        },
        signal: ac.signal,
      });

      setMsgs((prev) => [...prev, { role: "ai", data, at: now() }]);
    } catch (e) {
      if (isAbortError(e)) return;
      setMsgs((prev) => [
        ...prev,
        {
          role: "ai_error",
          text: "Không gọi được AI. Kiểm tra API key hoặc mạng.",
          at: now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function stop() {
    acRef.current?.abort();
  }

  function clear() {
    stop();
    setMsgs([]);
    setInput("");
  }

  return (
    <div className="fixed bottom-5 right-5 z-[9999]">
      {/* Toggle button */}
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full bg-[color:var(--trust-blue)] px-4 py-3 text-[12px] font-extrabold text-white shadow-[0_12px_30px_rgba(27,73,101,0.25)] ring-1 ring-white/20 hover:brightness-95 active:brightness-90"
          aria-label="Mở trợ lý AI"
        >
          AI hỗ trợ
        </button>
      ) : null}

      {/* Panel */}
      {open ? (
        <div className="w-[340px] overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] ring-1 ring-black/10">
          <div className="flex items-center justify-between bg-[color:var(--trust-blue)] px-4 py-3 text-white">
            <div className="min-w-0">
              <div className="text-[13px] font-extrabold leading-tight">
                MindWell AI
              </div>
              {/* <div className="text-[11px] font-semibold text-white/80">
                Trả lời theo sections (JSON)
              </div> */}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clear}
                className="rounded-lg bg-white/15 px-2 py-1 text-[11px] font-bold hover:bg-white/20"
                title="Xóa hội thoại"
              >
                Xóa
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg bg-white/15 px-2 py-1 text-[11px] font-bold hover:bg-white/20"
                aria-label="Đóng"
                title="Đóng"
              >
                ✕
              </button>
            </div>
          </div>

          <div
            ref={listRef}
            className="max-h-[380px] space-y-3 overflow-auto p-3"
          >
            {msgs.length === 0 ? (
              <div className="rounded-xl bg-black/5 p-3 text-[12px] font-semibold text-black/55">
                Hỏi bất kỳ điều gì. Câu trả lời của AI có thể không chính xác.
              </div>
            ) : null}

            {msgs.map((m, idx) => {
              if (m.role === "user") {
                return (
                  <div key={idx} className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl bg-[color:var(--calm-background)] px-3 py-2 text-[12px] font-semibold text-[color:var(--corporate-blue)] ring-1 ring-black/5">
                      {m.text}
                    </div>
                  </div>
                );
              }

              if (m.role === "ai_error") {
                return (
                  <div key={idx} className="flex justify-start">
                    <div className="max-w-[90%] rounded-2xl bg-red-50 px-3 py-2 text-[12px] font-semibold text-red-700 ring-1 ring-red-200">
                      {m.text}
                    </div>
                  </div>
                );
              }

              // ai message
              const r = m.data;
              return (
                <div key={idx} className="flex justify-start">
                  <div className="max-w-[92%] rounded-2xl bg-white px-3 py-2 text-[12px] text-black/70 ring-1 ring-black/10">
                    <div className="text-[12px] font-extrabold text-[color:var(--corporate-blue)]">
                      {r.summary}
                    </div>

                    {r.safetyNotes?.length ? (
                      <div className="mt-2 rounded-xl bg-amber-50 p-2 text-[11px] font-semibold text-amber-900/80 ring-1 ring-amber-200">
                        <div className="font-extrabold text-amber-900">
                          Lưu ý
                        </div>
                        <ul className="mt-1 list-disc pl-5">
                          {r.safetyNotes.map((t, i) => (
                            <li key={i}>{t}</li>
                          ))}
                        </ul>
                      </div>
                    ) : null}

                    <div className="mt-2 space-y-2">
                      {r.sections.map((s) => (
                        <div key={s.key} className="rounded-xl bg-black/5 p-2">
                          <div className="text-[12px] font-extrabold text-[color:var(--corporate-blue)]">
                            {s.title}
                          </div>
                          <div className="mt-1 text-[12px] font-semibold leading-6 text-black/65">
                            {s.content}
                          </div>
                          {s.bullets?.length ? (
                            <ul className="mt-1 list-disc pl-5 text-[12px] font-semibold text-black/60">
                              {s.bullets.map((b, i) => (
                                <li key={i}>{b}</li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ))}
                    </div>

                    {r.followUps?.length ? (
                      <div className="mt-2 text-[11px] font-semibold text-black/50">
                        Gợi ý: {r.followUps.slice(0, 2).join(" • ")}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-black/10 p-3">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send();
                  }
                }}
                placeholder="Nhập câu hỏi..."
                className="h-10 flex-1 rounded-xl border border-black/10 bg-white px-3 text-[12px] font-semibold text-[color:var(--corporate-blue)] outline-none focus:border-[color:var(--innovation-sky)]"
              />

              <button
                type="button"
                onClick={send}
                disabled={!canSend}
                className="h-10 rounded-xl bg-[color:var(--trust-blue)] px-3 text-[12px] font-extrabold text-white disabled:opacity-60"
              >
                Gửi
              </button>

              <button
                type="button"
                onClick={stop}
                disabled={!loading}
                className="h-10 rounded-xl border border-black/10 bg-white px-3 text-[12px] font-extrabold text-[color:var(--corporate-blue)] disabled:opacity-60"
                title="Dừng"
              >
                Dừng
              </button>
            </div>

            <div className="mt-2 text-[10px] font-semibold text-black/40">
              Tip: Enter để gửi, Shift+Enter xuống dòng
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
