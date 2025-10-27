import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import bcrypt from "bcrypt";
import {
  pgTable,
  bigserial,
  varchar,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

// Schema inline para evitar dependências
const clients = pgTable("clients", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Seeder independente
async function runSeeder() {
  console.log("🚀 Iniciando seeder independente...");

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL não configurada");
  }

  const connectionString = process.env.DATABASE_URL;
  const client = postgres(connectionString, { prepare: false });
  const db = drizzle(client);

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
    console.log("🌱 Inserindo clients...");

    const insertedClients = await db
      .insert(clients)
      .values(clientsData)
      .returning();

    console.log(`✅ ${insertedClients.length} clients inseridos com sucesso:`);
    insertedClients.forEach((client) => {
      console.log(`   - ${client.name} (${client.email})`);
    });

    await client.end();
    console.log("✅ Seeder executado com sucesso!");
  } catch (error) {
    console.error("❌ Erro no seeder:", error);
    await client.end();
    process.exit(1);
  }
}

// Executar seeder
runSeeder().finally(() => {
  process.exit(0);
});
