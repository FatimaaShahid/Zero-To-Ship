import { API, request, authHeaders } from "./api";
import type { User, LoginResponse, Equipment, Notice, EquipmentStatus } from "./types";

// --- user-service ---

export function registerUser(payload: {
  full_name: string;
  email: string;
  password: string;
}): Promise<{ user_id: number; full_name: string; email: string; role: string }> {
  return request(`${API.user}/users/register`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function loginUser(payload: { email: string; password: string }): Promise<LoginResponse> {
  return request(`${API.user}/users/login`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getUser(userId: number, token: string | null): Promise<User> {
  return request(`${API.user}/users/${userId}`, {
    headers: authHeaders(token),
  });
}

// --- content_service ---

export function listEquipment(): Promise<Equipment[]> {
  return request(`${API.content}/api/equipment`);
}

export function updateEquipmentStatus(
  itemId: number,
  status: EquipmentStatus,
  updatedBy: number,
  token: string | null
): Promise<Equipment> {
  return request(`${API.content}/api/equipment/${itemId}`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ status, last_updated_by: updatedBy }),
  });
}

export function listNotices(): Promise<Notice[]> {
  return request(`${API.content}/api/notices`);
}

export function createNotice(
  payload: { title: string; body: string; created_by: number },
  token: string | null
): Promise<Notice> {
  return request(`${API.content}/api/notices`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
}

export async function* streamAsk(query: string, topK = 5): AsyncGenerator<string> {
  const res = await fetch(`${API.assistant}/api/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, top_k: topK }),
  });

  if (!res.ok || !res.body) {
    throw new Error(`Assistant request failed (${res.status})`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    yield decoder.decode(value, { stream: true });
  }
}
