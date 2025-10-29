// api.ts (minimal, typed, with timeout + error parsing)
export const API = import.meta.env?.VITE_API_URL ?? "http://localhost:4000";

/* Domain types (keep these) */


// --- Type guards ---
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
function isString(v: unknown): v is string {
  return typeof v === "string";
}
function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every(isString);
}

// pick first useful string from various shapes - determines if it is useable as a string, if not return undefined to let the type linter understand
function pickString(u: unknown): string | undefined { 
  if (isString(u)) return u;
  if (isStringArray(u)) return u.join("; ");
  if (Array.isArray(u)) {
    const msgs = u.map(pickString).filter(Boolean) as string[];
    return msgs.length ? msgs.join("; ") : undefined;
  }
  if (isRecord(u)) {
    // common keys first
    const direct =
      (isString(u.error) && u.error) ||
      (isString(u.message) && u.message) ||
      (isString(u.detail) && u.detail);
    if (direct) return direct;

    // { errors: [...] } or { errors: { field: [..] } }
    if ("errors" in u) {
      const s = pickString(u.errors);
      if (s) return s;
    }

    // { issues: [{ message: "..." }, ...] } (zod-like)
    if ("issues" in u) {
      const val = u.issues;
      if (Array.isArray(val)) {
        const msgs = val
          .map(i => (isRecord(i) && isString(i.message) ? i.message : pickString(i)))
          .filter(Boolean) as string[];
        if (msgs.length) return msgs.join("; ");
      } else {
        const s = pickString(val);
        if (s) return s;
      }
    }

    // fallback: look through values for a string
    for (const v of Object.values(u)) {
      const s = pickString(v);
      if (s) return s;
    }
  }
  return undefined;
}

/* Helpers */
function withQuery(path: string, query?: Record<string, unknown>) {
  if (!query || Object.keys(query).length === 0) return path;
  const usp = new URLSearchParams();

  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null) continue;

    if (Array.isArray(v)) {
      v.forEach(x => usp.append(k, String(x)));
    } else {
      usp.append(k, String(v));
    }
  }

  return `${path}?${usp.toString()}`;
}

export async function readErrorDetail(res: Response): Promise<string> {
  try {
    const data: unknown = await res.clone().json();

    if (isRecord(data)) {
      // access via index keys; TS sees data as Record<string, unknown>
      const simple =
        pickString(data["error"]) ??
        pickString(data["message"]) ??
        pickString(data["detail"]);
      if (simple) return simple;

      // { errors: [...] } or { errors: { field: [..] | "..." } }
      const errs = data["errors"];
      if (Array.isArray(errs)) {
        const msgs = errs
          .map(pickString)
          .filter((s): s is string => typeof s === "string");
        if (msgs.length) return msgs.join("; ");
      } else if (isRecord(errs)) {
        const msgs: string[] = [];
        for (const v of Object.values(errs)) {
          const s = pickString(v);
          if (s) msgs.push(s);
        }
        if (msgs.length) return msgs.join("; ");
      }

      // { issues: [{ message: "..." }, ...] } (zod-like) OR mixed
      const issues = data["issues"];
      if (Array.isArray(issues)) {
        const msgs = issues
          .map((i) => {
            if (isRecord(i) && typeof i["message"] === "string") return i["message"];
            return pickString(i);
          })
          .filter((s): s is string => typeof s === "string");
        if (msgs.length) return msgs.join("; ");
      }

      // fallback: stringify object
      return JSON.stringify(data);
    }
  } catch (err) {
    // JSON parse failed; fall through to text
    console.error("readErrorDetail json parse:", err);
  }

  // final fallback: text
  try {
    return (await res.text()) || "";
  } catch {
    return "";
  }
}

/* Core fetch */
type HttpOpts = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  query?: Record<string, unknown>;
  headers?: Record<string, string>;
  body?: unknown;              // object => JSON, FormData passes through
  timeoutMs?: number;
  signal?: AbortSignal;
};

export async function http<T>(path: string, opts: HttpOpts = {}): Promise<T> {
  const { method = "GET", query, headers, body, timeoutMs, signal } = opts;
  const url = API + withQuery(path, query);

  const ctrl = new AbortController();
  const timer = typeof timeoutMs === "number" && timeoutMs > 0
    ? setTimeout(() => ctrl.abort(), timeoutMs)
    : undefined;

  const h = new Headers(headers);
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const isJsonObject =
    body && typeof body === "object" &&
    !isFormData &&
    !(body instanceof URLSearchParams) &&
    !(body instanceof Blob);

  if (isJsonObject && !h.has("Content-Type")) h.set("Content-Type", "application/json");

  try {
    const res = await fetch(url, {
      method,
      headers: h,
      body: isFormData
        ? body
        : isJsonObject
        ? JSON.stringify(body)
        : (body as BodyInit | undefined),
      signal: signal ?? ctrl.signal,
    });

    if (!res.ok) {
      const detail = await readErrorDetail(res);
      throw new Error(`HTTP ${res.status}${detail ? ` – ${detail}` : ""}`.trim());
    }

    if (res.status === 204) return undefined as unknown as T;
    const ct = res.headers.get("content-type") ?? "";
    return (ct.includes("application/json") ? await res.json() : await res.text()) as T;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/* Ergonomic verbs (optional) */
export const get  = <T>(p: string, o?: Omit<HttpOpts, "method" | "body">) => http<T>(p, { ...o, method: "GET" });
export const post = <T>(p: string, body?: unknown, o?: Omit<HttpOpts, "method">) => http<T>(p, { ...o, method: "POST", body });
export const patch= <T>(p: string, body?: unknown, o?: Omit<HttpOpts, "method">) => http<T>(p, { ...o, method: "PATCH", body });
export const del  = <T>(p: string, o?: Omit<HttpOpts, "method" | "body">) => http<T>(p, { ...o, method: "DELETE" });

/* Resource-specific helpers that match your Express routes */
export const BoardsAPI = {
  list: () => get<Board[]>("/api/boards"),
  create: (payload: { name: string; slug: string }) => post<Board>("/api/boards", payload),
  bySlug: (slug: string) =>
    get<{ board: Board; issues: Issue[]; nextCursor: string | null }>(`/api/boards/${slug}`),
};

export const IssuesAPI = {
  list: (slug: string, q?: { status?: string; take?: number; cursor?: string }) =>
    get<{ items: Issue[]; nextCursor: string | null }>(`/api/boards/${slug}/issues`, { query: q }),
  create: (slug: string, payload: { title: string; description?: string | null }) =>
    post<Issue>(`/api/boards/${slug}/issues`, payload),
  updateStatus: (id: string, status: string) =>
    patch<Issue>(`/api/issues/${id}/status`, { status }),
};

/* Optional auth helper */
export const withAuth = (token?: string) =>
  token ? { headers: { Authorization: `Bearer ${token}` } } : {};
