"use server";

import { createClient } from "@/lib/supabase/client";
import bcrypt from "bcrypt";

// Interface para dados de login
export interface LoginCredentials {
  email: string;
  password: string;
}

// Interface para dados do client autenticado (sem senha)
export interface AuthenticatedClient {
  id: number;
  name: string;
  email: string;
  active: boolean;
}

// Server Action TEMPORÁRIA usando Supabase client até DATABASE_URL ser configurada
export async function validateLoginActionFallback(
  credentials: LoginCredentials
): Promise<AuthenticatedClient | null> {
  console.log("🔍 validateLoginActionFallback recebeu:", credentials);

  try {
    console.log("🔄 Usando fallback Supabase para login...");

    const supabase = createClient();

    // Buscar client pelo email
    const { data: clients, error } = await supabase
      .from("clients")
      .select("*")
      .eq("email", credentials.email)
      .eq("active", true)
      .limit(1);

    if (error || !clients || clients.length === 0) {
      console.log("❌ Client não encontrado:", credentials.email);
      return null;
    }

    const client = clients[0];

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
    console.log("✅ Login válido (fallback):", credentials.email);
    return {
      id: client.id,
      name: client.name, // Usar name do banco
      email: client.email,
      active: client.active,
    };
  } catch (error) {
    console.error("❌ Erro na validação de login (fallback):", error);
    return null;
  }
}

// Server Action para buscar client por ID usando Supabase
export async function getClientByIdActionFallback(
  id: number
): Promise<AuthenticatedClient | null> {
  try {
    const supabase = createClient();

    const { data: client, error } = await supabase
      .from("clients")
      .select("id, name, email, active")
      .eq("id", id)
      .eq("active", true)
      .single();

    if (error || !client) {
      return null;
    }

    return client;
  } catch (error) {
    console.error("❌ Erro ao buscar client (fallback):", error);
    return null;
  }
}

// Server Action para verificar se email já existe usando Supabase
export async function emailExistsActionFallback(
  email: string
): Promise<boolean> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("clients")
      .select("id")
      .eq("email", email)
      .limit(1);

    return !error && data && data.length > 0;
  } catch (error) {
    console.error("❌ Erro ao verificar email (fallback):", error);
    return false;
  }
}

// Server Action para resetar senha usando Supabase
export async function resetPasswordActionFallback(
  email: string
): Promise<string | null> {
  try {
    const supabase = createClient();

    // Gerar senha temporária
    const tempPassword = Math.random().toString(36).slice(-8);

    // Criar hash da nova senha
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    // Atualizar no banco usando Supabase
    const { error } = await supabase
      .from("clients")
      .update({
        password: hashedPassword,
        updated_at: new Date().toISOString(),
      })
      .eq("email", email)
      .eq("active", true);

    if (error) {
      console.error("❌ Erro ao resetar senha (fallback):", error);
      return null;
    }

    return tempPassword; // Retornar senha em texto limpo para enviar por email
  } catch (error) {
    console.error("❌ Erro ao resetar senha (fallback):", error);
    return null;
  }
}
