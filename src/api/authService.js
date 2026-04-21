import { decodeJWT, getMockUsers, buildMockJWT } from "../utils/jwt";

const MOCK_USERS_KEY = "nexus_mock_users";

export const MOCK_API = {
  register: async ({ name, email, password }) => {
    await new Promise(r => setTimeout(r, 1100));
    const users = getMockUsers();
    if (users.find(u => u.email === email)) throw new Error("Email already registered");
    const user = { id: crypto.randomUUID(), name, email, avatar: Math.floor(Math.random() * 4), createdAt: new Date().toISOString() };
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify([...users, { ...user, password }]));
    const token = buildMockJWT({ sub: user.id, name, email, avatar: user.avatar });
    const refreshToken = buildMockJWT({ sub: user.id, type: "refresh", exp: Math.floor(Date.now() / 1000) + 3600 * 24 * 7 });
    return { token, refreshToken, user };
  },
  login: async ({ email, password }) => {
    await new Promise(r => setTimeout(r, 900));
    const users = getMockUsers();
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) throw new Error("Invalid email or password");
    const { password: _, ...user } = found;
    const token = buildMockJWT({ sub: user.id, name: user.name, email, avatar: user.avatar });
    const refreshToken = buildMockJWT({ sub: user.id, type: "refresh" });
    return { token, refreshToken, user };
  },
  refreshToken: async (refreshToken) => {
    await new Promise(r => setTimeout(r, 400));
    const decoded = decodeJWT(refreshToken);
    if (!decoded) throw new Error("Invalid refresh token");
    const users = getMockUsers();
    const user = users.find(u => u.id === decoded.sub);
    if (!user) throw new Error("User not found");
    const { password: _, ...safe } = user;
    const newToken = buildMockJWT({ sub: user.id, name: user.name, email: user.email, avatar: user.avatar });
    return { token: newToken, user: safe };
  },
  requestPasswordReset: async ({ email }) => {
    await new Promise(r => setTimeout(r, 700));
    const users = getMockUsers();
    const user = users.find(u => u.email === email);
    if (!user) throw new Error("Email not found");
    const code = Math.random().toString(36).slice(2, 8).toUpperCase();
    const resets = JSON.parse(localStorage.getItem("nexus_password_resets") || "[]");
    const expiresAt = Date.now() + 1000 * 60 * 15;
    localStorage.setItem("nexus_password_resets", JSON.stringify([...resets.filter(r => r.email !== email), { email, code, expiresAt }]));
    return { email, code };
  },
  resetPassword: async ({ email, code, password }) => {
    await new Promise(r => setTimeout(r, 700));
    const resets = JSON.parse(localStorage.getItem("nexus_password_resets") || "[]");
    const resetEntry = resets.find((entry) => entry.email === email && entry.code === code);
    if (!resetEntry) throw new Error("Invalid reset code");
    if (resetEntry.expiresAt < Date.now()) throw new Error("Reset code expired");
    const users = getMockUsers();
    const idx = users.findIndex((u) => u.email === email);
    if (idx === -1) throw new Error("User not found");
    users[idx] = { ...users[idx], password };
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
    localStorage.setItem("nexus_password_resets", JSON.stringify(resets.filter((entry) => entry.email !== email)));
    return { email }; 
  },
  updateProfile: async ({ token, name, avatar }) => {
    await new Promise(r => setTimeout(r, 700));
    const decoded = decodeJWT(token);
    const users = getMockUsers();
    const idx = users.findIndex(u => u.id === decoded.sub);
    if (idx === -1) throw new Error("User not found");
    users[idx] = { ...users[idx], name, avatar };
    localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
    const { password: _, ...safe } = users[idx];
    const newToken = buildMockJWT({ sub: safe.id, name, email: safe.email, avatar });
    return { token: newToken, user: safe };
  }
};