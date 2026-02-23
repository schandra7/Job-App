import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [role, setRole] = useState(() => localStorage.getItem("role"));
  const [userId, setUserId] = useState(() => {
    const raw = localStorage.getItem("userId");
    return raw ? Number(raw) : null;
    });

  const login = ({ token, role, userId }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    if (userId != null) localStorage.setItem("userId", String(userId));
    setToken(token);
    setRole(role);
    setUserId(userId ?? null);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    setToken(null);
    setRole(null);
    setUserId(null);
  };

  const value = useMemo(() => ({ token, role, userId, login, logout }), [token, role, userId]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}