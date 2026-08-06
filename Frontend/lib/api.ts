// Base URLs for each microservice. Set these in .env.local — see
// .env.example. Left as separate env vars (not one gateway URL) because
// Phase 5 orchestration is the only phase that introduces a real gateway;
// until then each service is reached directly, matching docs/api_contract.md.
export const API = {
  user: process.env.NEXT_PUBLIC_USER_SERVICE_URL ?? "http://localhost:8000",
  content: process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL ?? "http://localhost:8001",
  assistant: process.env.NEXT_PUBLIC_AI_ASSISTANT_URL ?? "http://localhost:8002",
};

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail ?? detail;
    } catch {
      // response wasn't JSON — keep statusText
    }
    throw new ApiError(detail, res.status);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export function authHeaders(token: string | null): HeadersInit {
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export { request };
