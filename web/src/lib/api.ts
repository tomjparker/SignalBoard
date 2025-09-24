const API = import.meta.env.VITE_API_URL ?? "";

export type Issue = {
  id: string;
  title: string;
  description?: string | null;
  status?: string;
  priority?: number;
  createdAt?: string;
  updatedAt?: string;
  boardId?: string;
};

export type Board = {
  id: string;
  name: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
};

// 1) Types for JSON bodies you want to stringify
type JsonPrimitive = string | number | boolean | null;
export type JsonValue =
  | JsonPrimitive
  | { [k: string]: JsonValue }
  | JsonValue[];

// 2) What your request body can be
type BodyLike =
  | JsonValue                // plain objects/arrays you want JSON.stringified
  | BodyInit                 // Blob | FormData | URLSearchParams | string | etc.
  | null
  | undefined;

// If you have HTTPOptions, make its body use BodyLike:
type HTTPOptions = Omit<RequestInit, "body"> & {
  body?: BodyLike;
  query?: Record<string, unknown>;
  timeoutMs?: number;
  retries?: number;
};

// 3) Encode body (no `any`)
function encodeBody(b: BodyLike): { body?: BodyInit; isJson: boolean; isForm: boolean } {
  if (b == null) return { body: undefined, isJson: false, isForm: false };
  if (typeof FormData !== "undefined" && b instanceof FormData)
    return { body: b, isJson: false, isForm: true };

  // BodyInit cases that should pass through
  if (
    typeof b === "string" ||
    (typeof Blob !== "undefined" && b instanceof Blob) ||
    (typeof URLSearchParams !== "undefined" && b instanceof URLSearchParams) ||
    (typeof ReadableStream !== "undefined" && b instanceof ReadableStream) ||
    (typeof ArrayBuffer !== "undefined" && b instanceof ArrayBuffer) ||
    ArrayBuffer.isView?.(b as any)
  ) {
    return { body: b as BodyInit, isJson: false, isForm: false };
  }

  // Otherwise treat as JSON
  return { body: JSON.stringify(b as JsonValue), isJson: true, isForm: false };
}

/** Build URL query params */
function withQuery(path: string, query?: Record<string, unknown>) {
  if (!query || Object.keys(query).length === 0) return path;
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) v.forEach((x) => usp.append(k, String(x)));
    else usp.append(k, String(v));
  }
  return `${path}?${usp.toString()}`;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v)
}

function pickString(v: unknown): string | undefined {
	if (typeof v === "string") return v;
	if (Array.isArray(v)) {
		const msgs = v.filter((x): x is string => typeof x === "string");
		if (msgs.length) return msgs.join("; ")
	}
	return undefined;
}

/** Try to read a useful error body (JSON first, then text) */
async function readErrorDetail(res: Response): Promise<string> {
	try {
		// By Json
		const data: unknown = await res.clone().json();

		
		if (isRecord(data)) {

			// By simple method
			const simple = 
				pickString(data.error) ??
				pickString(data.message) ??
				pickString((data as { datail?: unknown}).detail);
			if (simple) return simple;

			// By Validation { errors: [...] } or { errors: { field: [messages] } }
			const errs = (data as { errors?: unknown }).errors;
			if (Array.isArray(errs)) {
				const msgs = errs.map(pickString).filter(Boolean) as string[];
				if (msgs.length) return msgs.join("; ")
			} else if (isRecord(errs)) {
				const msgs: string[] = [];
				for (const v of Object.values(errs)) {
					const s = pickString(v);
					if (s) msgs.push(s);
				}	
				if (msgs.length) return msgs.join("; ")
			}
			
			const issues = (data as { issues?: unknown }).issues;
			if (Array.isArray(issues)) {
				const msgs = issues
					.map((i) => (isRecord(i) && typeof i.message === "string" ? i.message : undefined))
					.filter(Boolean) as string[]
				if (msgs.length) return msgs.join("; ")
			}
			return JSON.stringify(data);
		}
	} catch (_err) {
		console.error("error in read error:", _err)
		// Fall though
	}
	try {
    const text = await res.text();
    return text || "";
	} catch (_err) {
		console.error("error in parse:", _err)
		return "";
	}
}

/** Core request (keeps logic, adds timeout + form-data handling) */
export async function httpRequest<T>(
  path: string,
  init: HTTPOptions = {}
): Promise<T> {
  const { query, timeoutMs, headers, body, ...rest } = init;

  // Abort/timeout
  const controller = new AbortController();
  const timeoutId =
    typeof timeoutMs === "number" && timeoutMs > 0
      ? setTimeout(() => controller.abort(), timeoutMs)
      : undefined;

  const { body: encodedBody, isJson, isForm } = encodeBody(body);
  
  const h = new Headers(headers as HeadersInit); // Normalize headers safely
  
  if (isForm) {
    // Ensure browser sets multipart boundary
    h.delete("Content-Type");
  } else if (isJson && !h.has("Content-Type")) {
    h.set("Content-Type", "application/json");
  }

  const res = await fetch(API + withQuery(path, query), {
    signal: controller.signal,
    headers: h,  
    body: encodedBody,
    ...rest,
  }).finally(() => {
    if (timeoutId) clearTimeout(timeoutId);
  });

  if (!res.ok) {
    const detail = await readErrorDetail(res);
    throw new Error(
      `HTTP ${res.status} ${res.statusText}${detail ? ` – ${detail}` : ""}`
    );
  }

  // 204 No Content or empty
  if (res.status === 204) return undefined as unknown as T;

  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }
  const text = await res.text();
  return (text ? (text as unknown as T) : (undefined as unknown as T));
}

/* ---------------------------
   Ergonomic CRUD wrappers
---------------------------- */

export const get = <T>(
  path: string,
  opts?: Omit<HTTPOptions, "method" | "body">
) => httpRequest<T>(path, { ...opts, method: "GET" });

export const post = <T, B = unknown>(
  path: string,
  body?: B,
  opts?: Omit<HTTPOptions, "method" | "body">
) => httpRequest<T>(path, { ...opts, method: "POST", body });

export const put = <T, B = unknown>(
  path: string,
  body?: B,
  opts?: Omit<HTTPOptions, "method" | "body">
) => httpRequest<T>(path, { ...opts, method: "PUT", body });

export const patch = <T, B = unknown>(
  path: string,
  body?: B,
  opts?: Omit<HTTPOptions, "method" | "body">
) => httpRequest<T>(path, { ...opts, method: "PATCH", body });

export const del = <T>(
  path: string,
  opts?: Omit<HTTPOptions, "method" | "body">
) => httpRequest<T>(path, { ...opts, method: "DELETE" });

/* ---------------------------
   Example resource clients
---------------------------- */

// Issues
export type IssueCreate = Pick<Issue, "title" | "description" | "boardId"> & {
  status?: string;
  priority?: number;
};
export type IssueUpdate = Partial<
  Pick<Issue, "title" | "description" | "status" | "priority" | "boardId">
>;

export const IssuesAPI = {
  list: (query?: { boardId?: string; status?: string; q?: string; page?: number; pageSize?: number }) =>
    get<Issue[]>("/issues", { query }),

  getById: (id: string) => get<Issue>(`/issues/${id}`),

  create: (payload: IssueCreate) => post<Issue, IssueCreate>("/issues", payload),

  update: (id: string, payload: IssueUpdate) =>
    patch<Issue, IssueUpdate>(`/issues/${id}`, payload),

  remove: (id: string) => del<void>(`/issues/${id}`),
};

// Boards
export type BoardCreate = Pick<Board, "name" | "slug">;
export type BoardUpdate = Partial<Pick<Board, "name" | "slug">>;

export const BoardsAPI = {
  list: (query?: { q?: string }) => get<Board[]>("/boards", { query }),
  getById: (id: string) => get<Board>(`/boards/${id}`),
  create: (payload: BoardCreate) => post<Board, BoardCreate>("/boards", payload),
  update: (id: string, payload: BoardUpdate) =>
    patch<Board, BoardUpdate>(`/boards/${id}`, payload),
  remove: (id: string) => del<void>(`/boards/${id}`),
};

/* ---------------------------
   Auth header helper (optional)
---------------------------- */

// If you have a token, use like: get<T>("/x", withAuth(token))
export const withAuth = (token?: string): Pick<HTTPOptions, "headers"> =>
  token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : { headers: {} };
