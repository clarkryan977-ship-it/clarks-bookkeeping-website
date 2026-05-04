export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

async function request<T>(
  path: string,
  init: RequestInit = {}
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(path, {
      credentials: "include",
      ...init,
      headers: {
        ...(init.body && !(init.body instanceof FormData)
          ? { "Content-Type": "application/json" }
          : {}),
        ...(init.headers || {}),
      },
    });
    const text = await res.text();
    let body: unknown = null;
    if (text) {
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }
    }
    if (!res.ok) {
      const errorMsg =
        (body && typeof body === "object" && "error" in body
          ? String((body as { error: unknown }).error)
          : null) || `Request failed (${res.status})`;
      return { ok: false, error: errorMsg };
    }
    return { ok: true, data: body as T };
  } catch (err) {
    return { ok: false, error: (err as Error).message || "Network error" };
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
    }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
