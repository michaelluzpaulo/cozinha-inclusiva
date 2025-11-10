import { db } from "@/db";
import { clients } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { Client } from "@/Contracts/Client";
import { hashPassword, emailExists } from "@/db/auth";

export class ClientAction {
  // Buscar todos os clients
  static async getAll(): Promise<Client[]> {
    try {
      const clientsResult = await db
        .select({
          id: clients.id,
          name: clients.name,
          email: clients.email,
          active: clients.active,
          created_at: clients.createdAt,
          updated_at: clients.updatedAt,
        })
        .from(clients);

      // Transformar para formato Client
      return clientsResult.map((client) => ({
        id: client.id,
        nome: client.name || "", // Mapear name do banco para nome do frontend, garantindo string
        name: client.name || "", // Também disponibilizar como name, garantindo string
        email: client.email || "", // Garantindo string
        password: "", // Não retornar senha
        active: client.active ?? false, // Garantindo boolean
        created_at: client.created_at || "",
        updated_at: client.updated_at || "",
      }));
    } catch (error) {
      console.error("❌ Erro ao buscar clients:", error);
      throw error;
    }
  }

  // Buscar client por ID
  static async getById(id: number): Promise<Client | null> {
    try {
      const [client] = await db
        .select({
          id: clients.id,
          name: clients.name,
          email: clients.email,
          active: clients.active,
          created_at: clients.createdAt,
          updated_at: clients.updatedAt,
        })
        .from(clients)
        .where(eq(clients.id, id))
        .limit(1);

      if (!client) {
        return null;
      }

      return {
        id: client.id,
        nome: client.name || "", // Mapear name do banco para nome do frontend, garantindo string
        name: client.name || "", // Também disponibilizar como name, garantindo string
        email: client.email || "", // Garantindo string
        password: "",
        active: client.active ?? false, // Garantindo boolean
        created_at: client.created_at || "",
        updated_at: client.updated_at || "",
      };
    } catch (error) {
      console.error("❌ Erro ao buscar client:", error);
      return null;
    }
  }

  // Criar novo client
  static async create(clientData: {
    nome: string;
    email: string;
    password: string;
    active?: boolean;
  }): Promise<Client | null> {
    try {
      // Verificar se email já existe
      const exists = await emailExists(clientData.email);
      if (exists) {
        throw new Error("Email já cadastrado");
      }

      // Criar hash da senha
      const hashedPassword = await hashPassword(clientData.password);

      // Inserir no banco
      const [newClient] = await db
        .insert(clients)
        .values({
          name: clientData.nome, // Usar nome recebido do frontend e salvar como name no banco
          email: clientData.email,
          password: hashedPassword,
          active: clientData.active ?? true,
        })
        .returning({
          id: clients.id,
          name: clients.name,
          email: clients.email,
          active: clients.active,
          created_at: clients.createdAt,
          updated_at: clients.updatedAt,
        });

      return {
        id: newClient.id,
        nome: newClient.name || "", // Mapear name do banco para nome do frontend, garantindo string
        name: newClient.name || "", // Também disponibilizar como name, garantindo string
        email: newClient.email || "", // Garantindo string
        password: "",
        active: newClient.active ?? false, // Garantindo boolean
        created_at: newClient.created_at || "",
        updated_at: newClient.updated_at || "",
      };
    } catch (error) {
      console.error("❌ Erro ao criar client:", error);
      throw error;
    }
  }

  // Atualizar client
  static async update(
    id: number,
    clientData: {
      nome?: string;
      email?: string;
      password?: string;
      active?: boolean;
    }
  ): Promise<Client | null> {
    try {
      const updateData: any = {
        updatedAt: new Date().toISOString(),
      };

      if (clientData.nome) updateData.name = clientData.nome; // Mapear nome do frontend para name no banco
      if (clientData.email) updateData.email = clientData.email;
      if (clientData.active !== undefined)
        updateData.active = clientData.active;

      // Se há nova senha, fazer hash
      if (clientData.password) {
        updateData.password = await hashPassword(clientData.password);
      }

      const [updatedClient] = await db
        .update(clients)
        .set(updateData)
        .where(eq(clients.id, id))
        .returning({
          id: clients.id,
          name: clients.name,
          email: clients.email,
          active: clients.active,
          created_at: clients.createdAt,
          updated_at: clients.updatedAt,
        });

      if (!updatedClient) {
        return null;
      }

      return {
        id: updatedClient.id,
        nome: updatedClient.name || "", // Mapear name do banco para nome do frontend, garantindo string
        name: updatedClient.name || "", // Também disponibilizar como name, garantindo string
        email: updatedClient.email || "", // Garantindo string
        password: "",
        active: updatedClient.active ?? false, // Garantindo boolean
        created_at: updatedClient.created_at || "",
        updated_at: updatedClient.updated_at || "",
      };
    } catch (error) {
      console.error("❌ Erro ao atualizar client:", error);
      throw error;
    }
  }

  // Deletar client (soft delete - desativar)
  static async delete(id: number): Promise<boolean> {
    try {
      const [deletedClient] = await db
        .update(clients)
        .set({
          active: false,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(clients.id, id))
        .returning({ id: clients.id });

      return !!deletedClient;
    } catch (error) {
      console.error("❌ Erro ao deletar client:", error);
      throw error;
    }
  }

  // Hard delete (remover permanentemente)
  static async hardDelete(id: number): Promise<boolean> {
    try {
      const [deletedClient] = await db
        .delete(clients)
        .where(eq(clients.id, id))
        .returning({ id: clients.id });

      return !!deletedClient;
    } catch (error) {
      console.error("❌ Erro ao remover client permanentemente:", error);
      throw error;
    }
  }

  // Ativar/Desativar client
  static async toggleActive(id: number): Promise<Client | null> {
    try {
      // Primeiro buscar o estado atual
      const currentClient = await this.getById(id);
      if (!currentClient) {
        return null;
      }

      // Inverter o estado active
      const [updatedClient] = await db
        .update(clients)
        .set({
          active: !currentClient.active,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(clients.id, id))
        .returning({
          id: clients.id,
          name: clients.name,
          email: clients.email,
          active: clients.active,
          created_at: clients.createdAt,
          updated_at: clients.updatedAt,
        });

      if (!updatedClient) {
        return null;
      }

      return {
        id: updatedClient.id,
        nome: updatedClient.name || "", // Mapear name do banco para nome do frontend, garantindo string
        name: updatedClient.name || "", // Também disponibilizar como name, garantindo string
        email: updatedClient.email || "", // Garantindo string
        password: "",
        active: updatedClient.active ?? false, // Garantindo boolean
        created_at: updatedClient.created_at || "",
        updated_at: updatedClient.updated_at || "",
      };
    } catch (error) {
      console.error("❌ Erro ao alternar status do client:", error);
      throw error;
    }
  }
}
