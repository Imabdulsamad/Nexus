export const decodeJWT = (token) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch { return null; }
};

export const isTokenExpired = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded?.exp) return true;
  return Date.now() / 1000 > decoded.exp;
};

export const getInitials = (name) => 
  name?.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "??";

const MOCK_USERS_KEY = "nexus_mock_users";

export const getMockUsers = () => {
  try { return JSON.parse(localStorage.getItem(MOCK_USERS_KEY) || "[]"); }
  catch { return []; }
};

export const buildMockJWT = (payload) => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = btoa(JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 3600 * 24 }));
  const sig = btoa("mock_signature_" + payload.sub);
  return `${header}.${body}.${sig}`;
};