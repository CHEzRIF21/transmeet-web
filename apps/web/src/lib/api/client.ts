const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { accessToken?: string } = {}
): Promise<{ success: boolean; data?: T; error?: string; code?: string }> {
  const { accessToken, ...init } = options;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...init.headers,
  };
  if (accessToken) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${accessToken}`;
  }
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      success: false,
      error: json.error ?? "Erreur réseau",
      code: json.code,
    };
  }
  return json;
}
