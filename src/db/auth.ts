import { db } from "./index";
import { clients } from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

// Interface para dados de login
export interface LoginCredentials {
  email: string;
  password: string;
}

// Interface para dados do client autenticado
export interface AuthenticatedClient {
  id: number;
  name: string;
  email: string;
  active: boolean;
}

// Função para validar login usando bcrypt
export async function validateLogin(
  credentials: LoginCredentials
): Promise<AuthenticatedClient | null> {
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
      name: client.name,
      email: client.email,
      active: client.active,
    };
  } catch (error) {
    console.error("❌ Erro na validação de login:", error);
    return null;
  }
}

// Função para buscar client por ID (para validar sessões)
export async function getClientById(
  id: number
): Promise<AuthenticatedClient | null> {
  try {
    const [client] = await db
      .select({
        id: clients.id,
        name: clients.name,
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

// Função para criar hash da senha
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// Função para criar novo client
export async function createClient(clientData: {
  name: string;
  email: string;
  password: string;
  active?: boolean;
}): Promise<AuthenticatedClient | null> {
  try {
    const hashedPassword = await hashPassword(clientData.password);

    const [newClient] = await db
      .insert(clients)
      .values({
        name: clientData.name,
        email: clientData.email,
        password: hashedPassword,
        active: clientData.active ?? true,
      })
      .returning({
        id: clients.id,
        name: clients.name,
        email: clients.email,
        active: clients.active,
      });

    return newClient;
  } catch (error) {
    console.error("❌ Erro ao criar client:", error);
    return null;
  }
}

// Função para verificar se email já existe
export async function emailExists(email: string): Promise<boolean> {
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
