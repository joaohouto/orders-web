import React, { createContext, useCallback, useContext, useState } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const token = localStorage.getItem("@iGym:Token");
    const user = localStorage.getItem("@iGym:User");

    if (token && user) {
      api.defaults.headers = {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
        "x-access-token": token,
      };

      return { token, user: JSON.parse(user) };
    }

    return {};
  });

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post("/login", {
      email,
      password,
    });

    const { token, user, refreshToken } = response.data;

    localStorage.setItem("@iGym:Token", token);
    localStorage.setItem("@iGym:RefreshToken", refreshToken);
    localStorage.setItem("@iGym:User", JSON.stringify(user));

    api.defaults.headers["x-access-token"] = token;

    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem("@iGym:Token");
    localStorage.removeItem("@iGym:RefreshToken");
    localStorage.removeItem("@iGym:User");

    setData({});
  }, []);

  const updateUser = useCallback(
    (user) => {
      localStorage.setItem("@iGym:User", JSON.stringify(user));

      setData({
        token: data.token,
        user,
      });
    },
    [setData, data]
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("Context must be used within a ContextProvider");
  }

  return context;
}
