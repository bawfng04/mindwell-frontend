const KEY = "mindwell.accessToken";
const AUTH_EVENT = "mindwell.auth";

function notifyAuthChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(AUTH_EVENT));
  }
}

export function getAccessToken(): string | null {
  return localStorage.getItem(KEY);
}

export function setAccessToken(token: string) {
  localStorage.setItem(KEY, token);
  notifyAuthChanged();
}

export function clearAccessToken() {
  localStorage.removeItem(KEY);
  notifyAuthChanged();
}
