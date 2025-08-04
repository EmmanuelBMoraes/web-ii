// src/contexts/AuthContext.tsx
import { createContext, useState, useContext, type ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../lib/apiClient";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (
    variables: { email: string; senha: string },
    options?: { onSuccess?: () => void; onError?: (error: Error) => void }
  ) => void;
  logout: () => void;
  isLoggingIn: boolean;
  loginError: Error | null;
}

interface AuthProviderProps {
  children: ReactNode;
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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(initialToken);
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (credentials: { email: string; senha: string }) =>
      apiClient.post("/auth/login", credentials),

    onSuccess: (response) => {
      const newToken = response.data.token;
      setToken(newToken);
      setupAuth(newToken);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      return Promise.resolve();
    },
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
        logout: logoutMutation.mutate,
        isLoggingIn: loginMutation.isPending,
        loginError: loginMutation.error,
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
