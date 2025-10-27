import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { createClient } from "@/lib/supabase/client";
import * as schema from "@/db/schema";

// Configuração do Drizzle para servidor
let drizzleDb: ReturnType<typeof drizzle> | null = null;

export function getDrizzleClient() {
  if (typeof window !== "undefined") {
    // No client-side, não inicializar Drizzle
    return null;
  }

  if (!drizzleDb && process.env.DATABASE_URL) {
    try {
      const client = postgres(process.env.DATABASE_URL, { prepare: false });
      drizzleDb = drizzle(client, { schema });
    } catch (error) {
      console.error("Erro ao inicializar Drizzle:", error);
      return null;
    }
  }

  return drizzleDb;
}

// Cliente Supabase (funciona tanto no servidor quanto no cliente)
export function getSupabaseClient() {
  return createClient();
}

// Helper para escolher automaticamente entre Drizzle (servidor) e Supabase (cliente/fallback)
export function getDbClient() {
  // No servidor, tenta usar Drizzle primeiro
  if (typeof window === "undefined") {
    const drizzle = getDrizzleClient();
    if (drizzle) {
      return { type: "drizzle" as const, client: drizzle };
    }
  }

  // Fallback para Supabase (cliente ou servidor)
  return { type: "supabase" as const, client: getSupabaseClient() };
}
