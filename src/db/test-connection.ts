import dotenv from "dotenv";
dotenv.config();

import { db } from "./index";
import { clients } from "./schema";

async function testConnection() {
  try {
    console.log("🔍 Testando conexão com o banco de dados...");

    // Tentar buscar um client
    const testQuery = await db.select().from(clients).limit(1);

    console.log("✅ Conexão com o banco estabelecida com sucesso!");
    console.log(`📊 Resultado da query de teste:`, testQuery);

    return true;
  } catch (error) {
    console.error("❌ Erro na conexão com o banco de dados:");
    console.error(error);

    if (error instanceof Error) {
      if (error.message.includes("password authentication failed")) {
        console.log("\n🔧 SOLUÇÃO:");
        console.log("1. Acesse https://supabase.com/dashboard");
        console.log("2. Vá em Settings > Database");
        console.log("3. Copie a Connection String completa");
        console.log("4. Substitua DATABASE_URL no arquivo .env");
      }
    }

    return false;
  }
}

// Executar teste se o arquivo for chamado diretamente
if (require.main === module) {
  testConnection().finally(() => {
    process.exit(0);
  });
}

export { testConnection };
