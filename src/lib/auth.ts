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

const saveSession = (payload: AuthResponse) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(payload.user));
  notifyAuthChanged();
};

const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
  notifyAuthChanged();
};

export const validatePassword = (password: string) => {
  const minLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return {
    ok: minLength && hasUpper && hasNumber,
    minLength,
    hasUpper,
    hasNumber,
  };
};

export const registerUser = async (email: string, password: string) => {
  try {
    const result = await apiRequest<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: { email, password },
    });
    saveSession(result);
    return { ok: true as const };
  } catch (error) {
    return {
      ok: false as const,
      message: error instanceof Error ? error.message : "Registration failed.",
    };
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const result = await apiRequest<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
    saveSession(result);
    return { ok: true as const };
  } catch (error) {
    return {
      ok: false as const,
      message: error instanceof Error ? error.message : "Login failed.",
    };
  }
};

export const logoutUser = async () => {
  try {
    await apiRequest<void>("/api/auth/logout", {
      method: "POST",
    });
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

export const syncSession = async () => {
  try {
    const result = await apiRequest<{ user: SessionUser }>("/api/auth/me");
    localStorage.setItem(SESSION_KEY, JSON.stringify(result.user));
    notifyAuthChanged();
    return result.user.email;
  } catch {
    clearSession();
    return null;
  }
};
