const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://poseperfect-m80w.onrender.com";

type ApiOptions = {
  method?: string;
  body?: unknown;
};

export const apiRequest = async <T>(path: string, options: ApiOptions = {}): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
},
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = (await response.json().catch(() => ({}))) as { message?: string };

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data as T;
};
