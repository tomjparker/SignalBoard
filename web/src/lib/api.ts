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
}

export type Board = {
    id: string;
    name: string;
    slug: string;
    createdAt?: string;
    updatedAt?: string;
}

// Clarify this----
function withQuery(path: string, query?: Record<string, unknown>) {
  if (!query || Object.keys(query).length === 0) return path;
  const usp = new URLSearchParams(); 
  for (const[k, v] of Object.entries(query)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) v.forEach((x) => usp.append(k, String(x)))
    else usp.append(k, String(v));
  }
  return `${path}?${usp.toString()}`;
}

async function readErrorDetail(res: Response): Promise<string> {
  try {
    const data = await res.clone().json(); // JSON as priority
    if (data && typeof data === "object") {
      // common shapes: { error: "..."} or { message: "..."} or validation arrays
      const msg = (data.error ?? data.message ?? JSON.stringify(data));
      return typeof msg === "string" ? msg : JSON.stringify(msg);
    }
  } catch (err) { 
    console.log("err: ", err)
  }

  // Fallback to text 
  try {
    const text = await res.text();
    return text || "";
  } catch {
    return "";
  }
}

type HTTPOptions = RequestInit & {
  query?: Record<string, unknown>; // Query params object that we build from e.g. '?a=1&b=2'
  timeoutMs?: number; // Creates AbortController
}

export async function httpRequest<T>(path: string, init: HTTPOptions = {}): Promise<T> {
  const { query, timeoutMS, headers, body, ...rest } = init;
  const controller = new AbortController();
  const timeoutId = typeof timeoutMS === "number" && timeoutMs > 0
    ? setTimeout(() => controller.abort(), timeoutMs)
    : undefined;
  
    // If body is FormData dont set JSON headers
    const isFormData = typeof FormData !== "undefined" && body instanceOf FormData;

    const res = await fetch(API + withQuery(path, query), {
      signal: controller.signal,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(headers || {})
      },
      body: isFormData || body == null ? (body as any) : JSON.stringify(body),
      ...rest,
    }).finally(() => {
      if (timeoutId) clearTimeout(timoutId);
    })
    });

  const res = await fetch(API + path, {
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    ...init,
  });

  if (!res.ok) {
    const detail = await readErrorDetail(res);
    throw new Error(
      `HTTP ${res.status} ${res.statusText}${detail ? ` – ${detail}` : ""}`
    );
  }

  // If JSON, parse as JSON; otherwise return text (typed as T)
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }

  const text = await res.text();
  // If the endpoint returns no body, let T be void/undefined at the call site if needed
  return (text ? (text as unknown as T) : (undefined as unknown as T));
}

// export async function listIssues(board = "default") 
// {
//     const res = await fetch (`${API}/api/boards/${board}/issues`)
//     if(!res.ok) throw new Error(`Failed to fetch data: ${res.status}`);
//     return res.json() as Promise<Array<
// }

// export async function createIssue(board: string, data: { title: string; description?: string }) {
//     const res = await fetch(`${API}`)
// }

// export async function listIssues(board: string, data)
// {

// }