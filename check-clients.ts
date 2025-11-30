import { config } from "dotenv";
config();

import { db } from "@/db";
import { clients } from "@/db/schema";

async function checkClients() {
  console.log("🔍 Verificando clientes existentes...");

  try {
    const allClients = await db
      .select({ id: clients.id, name: clients.name, email: clients.email })
      .from(clients);

    console.log("👥 Clientes encontrados:");
    allClients.forEach((client) => {
      console.log(
        `  ID: ${client.id} - Nome: ${client.name} - Email: ${client.email}`
      );
    });

    console.log(`\n📊 Total: ${allClients.length} clientes`);

    return allClients;
  } catch (error) {
    console.error("❌ Erro:", error);
    return [];
  }
}

checkClients().then(() => process.exit(0));
