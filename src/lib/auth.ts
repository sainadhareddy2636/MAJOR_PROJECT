type StoredUser = {
  email: string;
  password: string;
};

const USERS_KEY = "poseperfect:users";
const SESSION_KEY = "poseperfect:session";

const getUsers = (): StoredUser[] => {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredUser[]) : [];
  } catch {
    return [];
  }
};

const saveUsers = (users: StoredUser[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
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

export const registerUser = (email: string, password: string) => {
  const users = getUsers();
  const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return { ok: false, message: "Email already registered. Please sign in." };
  }
  users.push({ email, password });
  saveUsers(users);
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email }));
  return { ok: true };
};

export const loginUser = (email: string, password: string) => {
  const users = getUsers();
  const match = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!match) {
    return { ok: false, message: "Invalid email or password." };
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email }));
  return { ok: true };
};

export const logoutUser = () => {
  localStorage.removeItem(SESSION_KEY);
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
