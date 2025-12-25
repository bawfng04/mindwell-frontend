// mindwell-frontend/src/services/gemini.ts
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
  if (!API_KEY) {
    throw new Error("Missing VITE_GEMINI_API_KEY");
  }
}

function buildPrompt(input: {
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
    `- Chỉ xuất ra DUY NHẤT một JSON object hợp lệ.`,
    `- Không thêm markdown, không thêm text ngoài JSON.`,
    `- Tất cả field phải đúng kiểu, không được null (trừ các field optional).`,
    ``,
    `JSON schema (mô tả):`,
    `{
      "answerId": "string (uuid-like)",
      "locale": "${locale}",
      "summary": "string (1-2 câu)",
      "sections": [
        {
          "key": "string (snake_case, unique)",
          "title": "string",
          "content": "string (đoạn chính, ngắn gọn)",
          "bullets": ["string", "..."] (optional),
          "actions": [{"label":"string","url":"string(optional)"}] (optional)
        }
      ],
      "followUps": ["string", "string", "string"],
      "safetyNotes": ["string", "..."] (optional)
    }`,
    ``,
    `QUY TẮC NỘI DUNG:`,
    `- Trả lời bằng ${locale === "vi" ? "tiếng Việt" : "English"}.`,
    `- Chia sections theo logic: (1) Tóm tắt, (2) Phân tích, (3) Bước thực hiện, (4) Lưu ý.`,
    `- Nếu người dùng hỏi về sức khỏe tinh thần, thêm safetyNotes khuyên tìm chuyên gia khi cần.`,
    `- Nếu thiếu thông tin, hỏi ngược lại trong followUps.`,
    ``,
    `Câu hỏi người dùng:`,
    input.userMessage.trim(),
  ].join("\n");
}

export async function geminiGenerateSections(input: {
  userMessage: string;
  locale?: "vi" | "en";
  context?: { page?: string; userGoal?: string };
  signal?: AbortSignal;
}): Promise<AiStructuredResponse> {
  assertConfigured();

  const prompt = buildPrompt(input);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    MODEL
  )}:generateContent?key=${encodeURIComponent(API_KEY!)}`;

  const res = await fetch(url, {
    method: "POST",
    signal: input.signal,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1200,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Gemini error: ${res.status} ${text}`);
  }

  const data = (await res.json()) as GeminiGenerateContentResponse;
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  try {
    return JSON.parse(text) as AiStructuredResponse;
  } catch {
    return {
      answerId: "fallback",
      locale: input.locale ?? "vi",
      summary: "Không parse được JSON từ model. Trả về nội dung thô.",
      sections: [{ key: "raw", title: "Nội dung", content: text || "—" }],
      followUps: ["Bạn muốn mình trả lời theo hướng nào (ngắn gọn/chi tiết)?"],
    };
  }
}
