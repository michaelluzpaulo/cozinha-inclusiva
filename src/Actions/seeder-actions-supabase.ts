"use server";

import { createClient } from "@/lib/supabase/client";
import bcrypt from "bcrypt";

// Server Action para executar seeder usando Supabase diretamente
export async function seedClientsActionSupabase() {
  console.log("🌱 Executando seeder de clients via Supabase...");

  const saltRounds = 12;
  const supabase = createClient();

  const clientsData = [
    {
      name: "Administrador",
      email: "admin@cozinhainclusiva.com",
      password: await bcrypt.hash("admin123", saltRounds),
      active: true,
    },
    {
      name: "João Silva",
      email: "joao.silva@email.com",
      password: await bcrypt.hash("senha123", saltRounds),
      active: true,
    },
    {
      name: "Maria Santos",
      email: "maria.santos@email.com",
      password: await bcrypt.hash("maria456", saltRounds),
      active: true,
    },
    {
      name: "Pedro Oliveira",
      email: "pedro.oliveira@email.com",
      password: await bcrypt.hash("pedro789", saltRounds),
      active: false,
    },
    {
      name: "Ana Costa",
      email: "ana.costa@email.com",
      password: await bcrypt.hash("ana2024", saltRounds),
      active: true,
    },
  ];

  try {
    // Inserir clients no banco usando Supabase
    const { data: insertedClients, error } = await supabase
      .from("clients")
      .insert(clientsData)
      .select("id, name, email");

    if (error) {
      console.error("❌ Erro ao inserir clients:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log(
      `✅ ${insertedClients?.length || 0} clients inseridos com sucesso:`
    );
    insertedClients?.forEach((client) => {
      console.log(`   - ${client.name} (${client.email})`);
    });

    return {
      success: true,
      count: insertedClients?.length || 0,
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

// Server Action para limpar tabela clients usando Supabase
export async function clearClientsActionSupabase() {
  console.log("🗑️  Limpando tabela clients...");

  try {
    const supabase = createClient();

    const { data: deletedClients, error } = await supabase
      .from("clients")
      .delete()
      .neq("id", 0) // Deletar todos os registros
      .select("id, name");

    if (error) {
      console.error("❌ Erro ao limpar clients:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log(`✅ ${deletedClients?.length || 0} clients removidos`);
    return {
      success: true,
      count: deletedClients?.length || 0,
    };
  } catch (error) {
    console.error("❌ Erro ao limpar clients:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
}
