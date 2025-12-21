export class ApiError extends Error {
  status?: number;
  code?: string;
  details?: unknown;

  constructor(
    message: string,
    opts?: { status?: number; code?: string; details?: unknown }
  ) {
    super(message);
    this.name = "ApiError";
    this.status = opts?.status;
    this.code = opts?.code;
    this.details = opts?.details;
  }
}

const DEFAULT_TIMEOUT_MS = 12_000;

function withTimeout(
  signal: AbortSignal | null | undefined,
  timeoutMs: number
) {
  const controller = new AbortController();
  const t = window.setTimeout(() => controller.abort(), timeoutMs);

  const onAbort = () => controller.abort();
  signal?.addEventListener("abort", onAbort, { once: true });

  return {
    signal: controller.signal,
    cleanup: () => {
      window.clearTimeout(t);
      signal?.removeEventListener("abort", onAbort);
    },
  };
}

export function getApiBaseUrl(): string {
  const base = import.meta.env.VITE_API_BASE_URL as string | undefined;
  return (base ?? "").replace(/\/+$/, "");
}

export function buildUrl(
  path: string,
  query?: Record<
    string,
    string | number | boolean | undefined | null | Array<string | number>
  >
) {
  const base = getApiBaseUrl();
  const url = new URL((base || "") + path, window.location.origin);

  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") return;

      if (Array.isArray(v)) {
        // Backend accepts comma-separated lists (docs mention specializationIds=1,2)
        url.searchParams.set(k, v.join(","));
        return;
      }

      url.searchParams.set(k, String(v));
    });
  }

  // If base is empty, keep relative (/api/..), not absolute to origin.
  return base ? url.toString() : url.pathname + (url.search ? url.search : "");
}

export async function httpJson<T>(
  url: string,
  init?: RequestInit & { timeoutMs?: number }
): Promise<T> {
  const timeoutMs = init?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const { signal, cleanup } = withTimeout(init?.signal, timeoutMs);

  try {
    const res = await fetch(url, {
      ...init,
      signal,
      headers: {
        Accept: "application/json",
        ...(init?.headers ?? {}),
      },
    });

    const text = await res.text();
    const data = text ? (JSON.parse(text) as unknown) : undefined;

    if (!res.ok) {
      throw new ApiError("Request failed", {
        status: res.status,
        details: data,
      });
    }

    return data as T;
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") {
      throw new ApiError("Request aborted/timeout", { code: "ABORTED" });
    }
    throw e;
  } finally {
    cleanup();
  }
}
