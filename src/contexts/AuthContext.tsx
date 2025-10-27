"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Client } from "@/Contracts/Client";

interface AuthContextType {
  client: Client | null;
  login: (client: Client) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar se há dados do cliente no localStorage
    if (typeof window !== "undefined") {
      const savedClient = localStorage.getItem("client");
      if (savedClient) {
        try {
          const clientData = JSON.parse(savedClient);

          // Validação básica dos dados do cliente
          if (clientData.id && clientData.email && clientData.active) {
            setClient(clientData);
          } else {
            // Dados inválidos, limpar localStorage
            localStorage.removeItem("client");
          }
        } catch (error) {
          console.error("Erro ao carregar dados do cliente:", error);
          localStorage.removeItem("client");
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = (clientData: Client) => {
    setClient(clientData);
    if (typeof window !== "undefined") {
      localStorage.setItem("client", JSON.stringify(clientData));
    }
  };

  const logout = () => {
    setClient(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("client");
    }
  };

  return (
    <AuthContext.Provider value={{ client, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
