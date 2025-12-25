import type { AiStructuredResponse } from "../types/ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const MODEL =
  (import.meta.env.VITE_GEMINI_MODEL as string | undefined) ??
  "gemini-2.5-flash";

type GeminiGenerateContentResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
};

function assertConfigured() {
  if (!API_KEY) throw new Error("Missing VITE_GEMINI_API_KEY");
}

function buildTextPrompt(input: {
  userMessage: string;
  locale?: "vi" | "en";
  context?: { page?: string; userGoal?: string };
}) {
  const locale = input.locale ?? "vi";
  const page = input.context?.page ?? "mindwell-frontend";
  const userGoal =
    input.context?.userGoal ?? "Trả lời rõ ràng, dễ đọc, theo từng mục";

  return [
    `Bạn là trợ lý AI cho ứng dụng MindWell.`,
    `Mục tiêu: ${userGoal}`,
    `Ngữ cảnh trang: ${page}`,
    ``,
    `YÊU CẦU ĐỊNH DẠNG (BẮT BUỘC):`,
    `- Trả lời bằng ${locale === "vi" ? "tiếng Việt" : "English"}.`,
    `- Chia đúng 4 mục theo đúng tiêu đề sau (viết y nguyên):`,
    `  1) TÓM TẮT`,
    `  2) PHÂN TÍCH`,
    `  3) BƯỚC THỰC HIỆN`,
    `  4) LƯU Ý`,
    `- Mỗi mục 3-7 dòng, ngắn gọn, dễ đọc.`,
    `- Không dùng JSON.`,
    ``,
    `Câu hỏi người dùng:`,
    input.userMessage.trim(),
  ].join("\n");
}

function pickText(data: GeminiGenerateContentResponse) {
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

export async function geminiGenerateText(input: {
  userMessage: string;
  locale?: "vi" | "en";
  context?: { page?: string; userGoal?: string };
  signal?: AbortSignal;
}): Promise<string> {
  assertConfigured();

  const prompt = buildTextPrompt(input);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    MODEL
  )}:generateContent?key=${encodeURIComponent(API_KEY!)}`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      signal: input.signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
        },
      }),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(
      `Network/CORS error: ${msg}. Kiểm tra mạng hoặc API key restrictions.`
    );
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Gemini error: ${res.status} ${text}`);
  }

  const data = (await res.json()) as GeminiGenerateContentResponse;
  const text = pickText(data).trim();

  if (!text) {
    return "TÓM TẮT\nKhông nhận được nội dung từ AI.\n\nPHÂN TÍCH\n—\n\nBƯỚC THỰC HIỆN\n—\n\nLƯU Ý\n—";
  }

  return text;
}

export async function geminiGenerateSections(input: {
  userMessage: string;
  locale?: "vi" | "en";
  context?: { page?: string; userGoal?: string };
  signal?: AbortSignal;
}): Promise<AiStructuredResponse> {
  const text = await geminiGenerateText(input);

  return {
    answerId: crypto?.randomUUID?.() ?? "text-only",
    locale: input.locale ?? "vi",
    summary: "Trả lời dạng text theo 4 mục.",
    sections: [{ key: "text", title: "Nội dung", content: text }],
    followUps: [],
  };
}
