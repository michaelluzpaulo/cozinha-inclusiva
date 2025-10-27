"use server";

import { db } from "@/db";
import { clients } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

// Interface para dados de login
export interface LoginCredentials {
  email: string;
  password: string;
}

// Interface para dados do client autenticado (sem senha)
export interface AuthenticatedClient {
  id: number;
  nome: string;
  email: string;
  active: boolean;
}

// Server Action para validar login usando bcrypt
export async function validateLoginAction(
  credentials: LoginCredentials
): Promise<AuthenticatedClient | null> {
  console.log("🔍 validateLoginAction recebeu:", credentials);

  try {
    // Buscar client pelo email
    const [client] = await db
      .select()
      .from(clients)
      .where(eq(clients.email, credentials.email))
      .limit(1);

    if (!client) {
      console.log("❌ Client não encontrado:", credentials.email);
      return null;
    }

    // Verificar se o client está ativo
    if (!client.active) {
      console.log("❌ Client inativo:", credentials.email);
      return null;
    }

    // Verificar senha usando bcrypt
    const isPasswordValid = await bcrypt.compare(
      credentials.password,
      client.password
    );

    if (!isPasswordValid) {
      console.log("❌ Senha inválida para:", credentials.email);
      return null;
    }

    // Login bem-sucedido
    console.log("✅ Login válido:", credentials.email);
    return {
      id: client.id,
      nome: client.nome,
      email: client.email,
      active: client.active,
    };
  } catch (error) {
    console.error("❌ Erro na validação de login:", error);
    return null;
  }
}

// Server Action para buscar client por ID (para validar sessões)
export async function getClientByIdAction(
  id: number
): Promise<AuthenticatedClient | null> {
  try {
    const [client] = await db
      .select({
        id: clients.id,
        nome: clients.nome,
        email: clients.email,
        active: clients.active,
      })
      .from(clients)
      .where(eq(clients.id, id))
      .limit(1);

    if (!client || !client.active) {
      return null;
    }

    return client;
  } catch (error) {
    console.error("❌ Erro ao buscar client:", error);
    return null;
  }
}

// Server Action para criar hash da senha
export async function hashPasswordAction(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// Server Action para verificar se email já existe
export async function emailExistsAction(email: string): Promise<boolean> {
  try {
    const [existingClient] = await db
      .select({ id: clients.id })
      .from(clients)
      .where(eq(clients.email, email))
      .limit(1);

    return !!existingClient;
  } catch (error) {
    console.error("❌ Erro ao verificar email:", error);
    return false;
  }
}

// Server Action para resetar senha
export async function resetPasswordAction(
  email: string
): Promise<string | null> {
  try {
    // Gerar senha temporária
    const tempPassword = Math.random().toString(36).slice(-8);

    // Criar hash da nova senha
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    // Atualizar no banco usando Drizzle
    const [updatedClient] = await db
      .update(clients)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(clients.email, email))
      .returning({ id: clients.id });

    if (!updatedClient) {
      return null;
    }

    return tempPassword; // Retornar senha em texto limpo para enviar por email
  } catch (error) {
    console.error("❌ Erro ao resetar senha:", error);
    return null;
  }
}
