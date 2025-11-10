import { defineConfig } from "drizzle-kit";
import { config } from "dotenv";

// Carregar variáveis de ambiente
config();

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_DIRECT_URL || process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
});
