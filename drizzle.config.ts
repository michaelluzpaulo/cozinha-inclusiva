import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  // Usar conexão direta para migrations se disponível
  ...(process.env.DATABASE_DIRECT_URL && {
    dbCredentials: {
      url: process.env.DATABASE_DIRECT_URL,
    },
  }),
  verbose: true,
  strict: true,
});
