import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";

const AuthCtx = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mantener sesión si hay token guardado
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    api.get("/auth/profile")
      .then((res) => setUser(res.data.usuario))
      .catch(() => localStorage.removeItem("token"))
      .finally(() => setLoading(false));
  }, []);

  const login = async (correo, password) => {
    const { data } = await api.post("/auth/login", { correo, password });
    localStorage.setItem("token", data.token);
    setUser(data.usuario);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
};

export const useAuth = () => useContext(AuthCtx);
