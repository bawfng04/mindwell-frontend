import React from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import type { MyAppointmentItemDto } from "../types/api";

function isAbortError(e: unknown) {
  return (
    (typeof e === "object" &&
      e !== null &&
      "name" in e &&
      (e as any).name === "AbortError") ||
    false
  );
}

function formatDateTimeVi(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-black/5 px-3 py-1 text-[11px] font-extrabold text-[color:var(--corporate-blue)] ring-1 ring-black/5">
      {children}
    </span>
  );
}

function Card({
  appt,
  isDraft,
}: {
  appt: MyAppointmentItemDto;
  isDraft: boolean;
}) {
  const time = `${formatDateTimeVi(appt.startTime)} → ${formatDateTimeVi(
    appt.endTime
  )}`;

  return (
    <article className="rounded-3xl bg-white p-5 shadow-[0_10px_30px_rgba(27,73,101,0.10)] ring-1 ring-[color:var(--innovation-sky)]/30">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[13px] font-extrabold text-[color:var(--corporate-blue)]">
            {appt.expertName}{" "}
            <span className="text-black/45 font-semibold">
              — {appt.expertTitle}
            </span>
          </div>
          <div className="mt-2 text-[12px] font-semibold text-black/55">
            {time}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Badge>apptId: {appt.apptId}</Badge>
            <Badge>status: {appt.status}</Badge>
            {appt.serviceType ? (
              <Badge>service: {appt.serviceType}</Badge>
            ) : null}
            {appt.platformName ? (
              <Badge>platform: {appt.platformName}</Badge>
            ) : null}
            {typeof appt.totalAmountPoints === "number" ? (
              <Badge>{appt.totalAmountPoints} points</Badge>
            ) : null}
            {appt.paymentId ? <Badge>paymentId: {appt.paymentId}</Badge> : null}
            {appt.paymentStatus ? (
              <Badge>payment: {appt.paymentStatus}</Badge>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {isDraft ? (
            <Link
              to={`/thanh-toan?apptId=${appt.apptId}`}
              className="inline-flex items-center justify-center rounded-2xl bg-[color:var(--trust-blue)] px-4 py-2 text-[12px] font-extrabold text-white hover:brightness-95 active:brightness-90"
            >
              Tiếp tục thanh toán
            </Link>
          ) : null}

          {appt.meetingJoinUrl ? (
            <a
              href={appt.meetingJoinUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2 text-[12px] font-extrabold text-[color:var(--corporate-blue)] ring-1 ring-black/10 hover:bg-black/5"
            >
              Join meeting
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default function AppointmentsPage() {
  const [tab, setTab] = React.useState<"all" | "drafts">("all");

  const [items, setItems] = React.useState<MyAppointmentItemDto[]>([]);
  const [drafts, setDrafts] = React.useState<MyAppointmentItemDto[]>([]);

  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  React.useEffect(() => {
    const ac = new AbortController();

    (async () => {
      setErr(null);
      setLoading(true);

      try {
        const [a, d] = await Promise.all([
          api.appointments.myAppointments({ signal: ac.signal }),
          api.appointments.myDraftAppointments({ signal: ac.signal }),
        ]);

        if (ac.signal.aborted) return;

        setItems(a ?? []);
        setDrafts(d ?? []);
      } catch (e) {
        if (ac.signal.aborted || isAbortError(e)) return;

        const status = (e as any)?.status;
        if (status === 401) setErr("Bạn cần đăng nhập để xem lịch hẹn.");
        else
          setErr("Không tải được danh sách lịch hẹn. Kiểm tra backend/proxy.");

        setItems([]);
        setDrafts([]);
      } finally {
        if (ac.signal.aborted) return;
        setLoading(false);
      }
    })();

    return () => ac.abort();
  }, []);

  const data = tab === "all" ? items : drafts;

  return (
    <section className="mx-auto max-w-6xl px-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[color:var(--corporate-blue)]">
            Lịch hẹn của tôi
          </h1>
          <div className="mt-1 text-[12px] font-semibold text-black/55">
            Xem apptId, trạng thái, và tiếp tục thanh toán các bản nháp.
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-white p-1 ring-1 ring-black/10">
          <button
            type="button"
            onClick={() => setTab("all")}
            className={[
              "rounded-full px-4 py-2 text-[12px] font-extrabold",
              tab === "all"
                ? "bg-[color:var(--trust-blue)] text-white"
                : "text-[color:var(--corporate-blue)] hover:bg-black/5",
            ].join(" ")}
          >
            Tất cả ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("drafts")}
            className={[
              "rounded-full px-4 py-2 text-[12px] font-extrabold",
              tab === "drafts"
                ? "bg-[color:var(--trust-blue)] text-white"
                : "text-[color:var(--corporate-blue)] hover:bg-black/5",
            ].join(" ")}
          >
            Bản nháp ({drafts.length})
          </button>
        </div>
      </div>

      {err ? (
        <div className="mt-5 rounded-2xl bg-white p-4 text-[12px] font-semibold text-red-700 ring-1 ring-red-200">
          {err}{" "}
          {(err.includes("đăng nhập") || err.includes("Đăng nhập")) && (
            <Link to="/dang-nhap" className="underline">
              Đăng nhập
            </Link>
          )}
        </div>
      ) : null}

      {loading ? (
        <div className="mt-6 rounded-2xl bg-white p-4 text-[12px] font-semibold text-black/55 ring-1 ring-black/5">
          Đang tải...
        </div>
      ) : null}

      {!loading && !err && data.length === 0 ? (
        <div className="mt-6 rounded-2xl bg-white p-6 text-[12px] font-semibold text-black/55 ring-1 ring-black/5">
          Không có lịch hẹn nào.
        </div>
      ) : null}

      <div className="mt-6 grid grid-cols-1 gap-5">
        {data.map((a) => (
          <Card key={a.apptId} appt={a} isDraft={tab === "drafts"} />
        ))}
      </div>
    </section>
  );
}
