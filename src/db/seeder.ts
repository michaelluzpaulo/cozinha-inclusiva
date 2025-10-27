import { db } from "./index";
import { clients } from "./schema";
import bcrypt from "bcrypt";

// Seeder para clients com senhas criptografadas
export async function seedClients() {
  console.log("🌱 Executando seeder de clients...");

  const saltRounds = 12;

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
    // Inserir clients no banco usando Drizzle
    const insertedClients = await db
      .insert(clients)
      .values(clientsData)
      .returning();

    console.log(`✅ ${insertedClients.length} clients inseridos com sucesso:`);
    insertedClients.forEach((client) => {
      console.log(`   - ${client.name} (${client.email})`);
    });

    return insertedClients;
  } catch (error) {
    console.error("❌ Erro ao inserir clients:", error);
    throw error;
  }
}

// Função para limpar tabela clients (use com cuidado!)
export async function clearClients() {
  console.log("🗑️  Limpando tabela clients...");

  try {
    const deletedClients = await db.delete(clients).returning();
    console.log(`✅ ${deletedClients.length} clients removidos`);
    return deletedClients;
  } catch (error) {
    console.error("❌ Erro ao limpar clients:", error);
    throw error;
  }
}

// Função principal do seeder
export async function runSeeder() {
  try {
    console.log("🚀 Iniciando processo de seeder...");

    // Opcional: limpar dados existentes
    // await clearClients();

    // Inserir novos dados
    await seedClients();

    console.log("✅ Seeder executado com sucesso!");
  } catch (error) {
    console.error("❌ Erro no seeder:", error);
    process.exit(1);
  }
}

// Executar seeder se o arquivo for chamado diretamente
if (require.main === module) {
  runSeeder().finally(() => {
    process.exit(0);
  });
}
