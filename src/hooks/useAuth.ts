"use client";

import { useState, useEffect } from "react";
import { AuthAction } from "@/Actions/Auth/AuthAction";
import { Client } from "@/Contracts/Client";

/**
 * Hook para validar sessão do usuário com o banco de dados
 * Usado para garantir que o usuário ainda está ativo e válido
 */
export function useSessionValidation(client: Client | null) {
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (!client?.id) {
      setIsValid(false);
      return;
    }

    const validateSession = async () => {
      setIsValidating(true);

      try {
        // Verificar se o client ainda existe e está ativo no banco
        const currentClient = await AuthAction.getClientById(client.id!);

        if (!currentClient || !currentClient.active) {
          setIsValid(false);
          // Limpar dados inválidos do localStorage
          localStorage.removeItem("client");
        } else {
          setIsValid(true);
        }
      } catch (error) {
        console.error("Erro na validação de sessão:", error);
        setIsValid(false);
      } finally {
        setIsValidating(false);
      }
    };

    // Validar sessão imediatamente
    validateSession();

    // Validar sessão a cada 5 minutos
    const interval = setInterval(validateSession, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [client?.id]);

  return { isValidating, isValid };
}

/**
 * Hook para logout automático em caso de sessão inválida
 */
export function useAutoLogout(isValid: boolean, logout: () => void) {
  useEffect(() => {
    if (!isValid) {
      logout();
    }
  }, [isValid, logout]);
}
