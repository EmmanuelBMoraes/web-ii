// src/contexts/AuthContext.tsx
import { createContext, useState, useContext, type ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/apiClient";
import {
  type LoginCredentials,
  type RegisterCredentials,
} from "../types/auth.type";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (
    credentials: LoginCredentials,
    options?: { onSuccess?: () => void }
  ) => void;
  logout: () => void;
  register: (
    credentials: RegisterCredentials,
    options?: { onSuccess?: () => void }
  ) => void;
  isLoggingIn: boolean;
  isRegistering: boolean;
  loginError: Error | null;
  registerError: Error | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

const setupAuth = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("authToken", token);
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
    localStorage.removeItem("authToken");
  }
};

const initialToken = localStorage.getItem("authToken");
if (initialToken) {
  setupAuth(initialToken);
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(initialToken);
  const queryClient = useQueryClient();

  const handleAuthSuccess = (response: any) => {
    const newToken = response.data.token;
    setToken(newToken);
    setupAuth(newToken);
  };

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      apiClient.post("/auth/login", credentials),
    onSuccess: handleAuthSuccess,
  });

  const registerMutation = useMutation({
    mutationFn: (credentials: RegisterCredentials) =>
      apiClient.post("/auth/register", credentials),
    onSuccess: handleAuthSuccess,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => Promise.resolve(),
    onSuccess: () => {
      setToken(null);
      setupAuth(null);
      queryClient.clear();
    },
  });

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login: loginMutation.mutate,
        register: registerMutation.mutate,
        logout: logoutMutation.mutate,
        isLoggingIn: loginMutation.isPending,
        isRegistering: registerMutation.isPending,
        loginError: loginMutation.error,
        registerError: registerMutation.error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
