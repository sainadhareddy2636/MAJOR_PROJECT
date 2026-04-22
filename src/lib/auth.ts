import { apiRequest } from "@/lib/api";

type SessionUser = {
  email: string;
};

type AuthResponse = {
  user: SessionUser;
};

const SESSION_KEY = "poseperfect:session";

const notifyAuthChanged = () => {
  window.dispatchEvent(new Event("poseperfect:auth-changed"));
};

const saveSession = (user: SessionUser) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  notifyAuthChanged();
};

const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
  notifyAuthChanged();
};

export const loginUser = async (email: string, password: string) => {
  try {
    const result = await apiRequest<{ user: { email: string } }>("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });

    // store session locally
    localStorage.setItem("poseperfect:session", JSON.stringify(result.user));

    return { ok: true as const };
  } catch (error) {
    return {
      ok: false as const,
      message: error instanceof Error ? error.message : "Login failed.",
    };
  }
};

export const registerUser = async (email: string, password: string) => {
  try {
    const result = await apiRequest<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: { email, password },
    });

    if (!result || !result.user) {
      throw new Error("Invalid registration response");
    }

    saveSession(result.user);

    return { ok: true as const };
  } catch (error) {
    return {
      ok: false as const,
      message: error instanceof Error ? error.message : "Registration failed.",
    };
  }
};

export const logoutUser = async () => {
  try {
    await apiRequest<void>("/api/auth/logout", { method: "POST" });
  } finally {
    clearSession();
  }
};

export const getSessionEmail = (): string | null => {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as { email?: string };
    return parsed.email ?? null;
  } catch {
    return null;
  }
};