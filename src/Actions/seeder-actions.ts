"use server";

import { db } from "@/db";
import { clients } from "@/db/schema";
import bcrypt from "bcrypt";

// Server Action para executar seeder de clients
export async function seedClientsAction() {
  console.log("🌱 Executando seeder de clients...");

  const saltRounds = 12;

  const clientsData = [
    {
      nome: "Administrador",
      email: "admin@cozinhainclusiva.com",
      password: await bcrypt.hash("admin123", saltRounds),
      active: true,
    },
    {
      nome: "João Silva",
      email: "joao.silva@email.com",
      password: await bcrypt.hash("senha123", saltRounds),
      active: true,
    },
    {
      nome: "Maria Santos",
      email: "maria.santos@email.com",
      password: await bcrypt.hash("maria456", saltRounds),
      active: true,
    },
    {
      nome: "Pedro Oliveira",
      email: "pedro.oliveira@email.com",
      password: await bcrypt.hash("pedro789", saltRounds),
      active: false,
    },
    {
      nome: "Ana Costa",
      email: "ana.costa@email.com",
      password: await bcrypt.hash("ana2024", saltRounds),
      active: true,
    },
  ];

  try {
    // Inserir clients no banco usando Drizzle
    const insertedClients = await db
      .insert(clients)
      .values(clientsData)
      .returning({
        id: clients.id,
        nome: clients.nome,
        email: clients.email,
      });

    console.log(`✅ ${insertedClients.length} clients inseridos com sucesso:`);
    insertedClients.forEach((client) => {
      console.log(`   - ${client.nome} (${client.email})`);
    });

    return {
      success: true,
      count: insertedClients.length,
      clients: insertedClients,
    };
  } catch (error) {
    console.error("❌ Erro ao inserir clients:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}

// Server Action para limpar tabela clients
export async function clearClientsAction() {
  console.log("🗑️  Limpando tabela clients...");

  try {
    const deletedClients = await db.delete(clients).returning({
      id: clients.id,
      nome: clients.nome,
    });

    console.log(`✅ ${deletedClients.length} clients removidos`);
    return {
      success: true,
      count: deletedClients.length,
    };
  } catch (error) {
    console.error("❌ Erro ao limpar clients:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}
