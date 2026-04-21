import { createContext, useContext, useState, useEffect } from "react";
import { isTokenExpired, decodeJWT } from "../utils/jwt";
import { MOCK_API } from "../api/authService";

const JWT_KEY = "nexus_token";
const USER_KEY = "nexus_user";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem(JWT_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (storedToken && storedUser && !isTokenExpired(storedToken)) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } else {
        const refreshToken = localStorage.getItem('nexus_refresh');
        if (refreshToken) {
          try {
            const result = await MOCK_API.refreshToken(refreshToken);
            saveSession(result.token, result.user);
          } catch (err) {
            console.warn('Silent refresh failed', err);
          }
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const saveSession = (newToken, newUser) => {
    localStorage.setItem(JWT_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const register = async (data) => {
    const result = await MOCK_API.register(data);
    localStorage.setItem("nexus_refresh", result.refreshToken);
    saveSession(result.token, result.user);
    return result;
  };

  const login = async (data) => {
    const result = await MOCK_API.login(data);
    localStorage.setItem("nexus_refresh", result.refreshToken);
    saveSession(result.token, result.user);
    return result;
  };

  const logout = () => {
    localStorage.removeItem(JWT_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem("nexus_refresh");
    setToken(null);
    setUser(null);
  };

  const refreshSession = async () => {
    const refreshToken = localStorage.getItem('nexus_refresh');
    if (!refreshToken) return null;

    try {
      const result = await MOCK_API.refreshToken(refreshToken);
      saveSession(result.token, result.user);
      return result;
    } catch (err) {
      console.warn('Failed to refresh token', err);
      logout();
      return null;
    }
  };

  const updateProfile = async (data) => {
    const result = await MOCK_API.updateProfile({ token, ...data });
    saveSession(result.token, result.user);
    return result;
  };

  const getAuthHeader = () => token ? { Authorization: `Bearer ${token}` } : {};

  useEffect(() => {
    const interval = setInterval(() => {
      if (!token) return;
      const decoded = decodeJWT(token);
      if (!decoded?.exp) return;
      const expiresIn = decoded.exp * 1000 - Date.now();
      if (expiresIn < 1000 * 60 * 10) {
        refreshSession();
      }
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, logout, updateProfile, getAuthHeader, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);