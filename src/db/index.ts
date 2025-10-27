import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const connectionString = process.env.DATABASE_URL;

// Disable prepared statements to work with Supabase connection pooling
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
