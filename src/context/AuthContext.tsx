import React, { createContext, useEffect, useState } from "react";

type Role = "CLIENTE" | "ADMIN";

type User = {
  name: string;
  email: string;
  role: Role;
};

type AuthContextType = {
  user: User | null;
  login: (u: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
};

const initial: AuthContextType = {
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  isAdmin: false,
};

export const AuthContext = createContext<AuthContextType>(initial);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem("vetici_user");
      return raw ? (JSON.parse(raw) as User) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem("vetici_user", JSON.stringify(user));
    else localStorage.removeItem("vetici_user");
  }, [user]);

  const login = (u: User) => setUser(u);
  const logout = () => setUser(null);

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === "ADMIN",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
