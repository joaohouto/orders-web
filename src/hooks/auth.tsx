import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  ReactNode,
} from "react";
import api from "@/services/api";
import { jwtDecode } from "jwt-decode";

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  document: string;
};

type AuthContextData = {
  user: User | null;
  saveToken: ({ token }: { token: string }) => Promise<void>;
  signOut: () => void;
  updateUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextData | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [data, setData] = useState<{
    token?: string;
    user: User | null;
  }>(() => {
    const token = localStorage.getItem("@Orders:Token");
    const user = localStorage.getItem("@Orders:User");

    if (token && user) {
      api.defaults.headers["authorization"] = `Bearer ${token}`;
      return { token, user: JSON.parse(user) as User };
    }

    return { user: null };
  });

  const saveToken = useCallback(async ({ token }: { token: string }) => {
    const user = jwtDecode<User>(token);

    localStorage.setItem("@Orders:Token", token);
    localStorage.setItem("@Orders:User", JSON.stringify(user));

    api.defaults.headers["authorization"] = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem("@Orders:Token");
    localStorage.removeItem("@Orders:User");

    setData({ user: null });
  }, []);

  const updateUser = useCallback(
    (user: User) => {
      localStorage.setItem("@Orders:User", JSON.stringify(user));
      setData({
        token: data.token,
        user,
      });
    },
    [data.token]
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, saveToken, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
