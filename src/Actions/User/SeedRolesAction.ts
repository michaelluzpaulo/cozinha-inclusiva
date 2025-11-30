import { db } from "@/db";
import { roles } from "@/db/schema";
import { eq } from "drizzle-orm";

export class SeedRolesAction {
  static async execute(): Promise<void> {
    try {
      const defaultRoles = [
        { name: "Admin" },
        { name: "Editor" },
        { name: "Usuário" },
      ];

      for (const role of defaultRoles) {
        // Verificar se a role já existe
        const existingRole = await db
          .select()
          .from(roles)
          .where(eq(roles.name, role.name))
          .limit(1);

        if (existingRole.length === 0) {
          await db.insert(roles).values(role);
          console.log(`Role '${role.name}' criada com sucesso`);
        } else {
          console.log(`Role '${role.name}' já existe`);
        }
      }
    } catch (error) {
      console.error("Erro ao criar roles:", error);
      throw error;
    }
  }
}
