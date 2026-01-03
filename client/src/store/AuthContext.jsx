import { createContext, useEffect, useState } from "react";
import api from "../lib/axios.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      if (userInfo && userInfo.token) {
        try {
          const { data } = await api.get("/auth/me");
          setUser({ ...data, token: userInfo.token }); 
        } catch (error) {
          console.error("Session expired or invalid:", error);
          localStorage.removeItem("userInfo");
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkUser();
  }, []);

  const login = async (username, password) => {
    const { data } = await api.post("/auth/login", { username, password });
    localStorage.setItem("userInfo", JSON.stringify(data));
    setUser(data);
  };

  const register = async (username, password, role) => {
    const { data } = await api.post("/auth/register", {
      username,
      password,
      role,
    });
    localStorage.setItem("userInfo", JSON.stringify(data));
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
