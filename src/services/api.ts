const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError(data.error || 'Error de red.', response.status);
  return data;
}

export function getProfile(profile: string) {
  return request<{ profile: string; cards: Record<string, number> }>(
    `/api/profile?profile=${encodeURIComponent(profile)}`
  );
}

export function updateCard(profile: string, cardId: string, quantity: number) {
  return request<{ profile: string; cards: Record<string, number> }>(
    '/api/profile',
    { method: 'PUT', body: JSON.stringify({ profile, cardId, quantity }) }
  );
}