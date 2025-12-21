import { getAccessToken } from "./token";

export function withAuth(headers?: HeadersInit): HeadersInit {
  const token = getAccessToken();
  if (!token) return headers ?? {};
  return { ...(headers ?? {}), Authorization: `Bearer ${token}` };
}
