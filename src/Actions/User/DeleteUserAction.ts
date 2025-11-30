import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export class DeleteUserAction {
  static async execute(id: number): Promise<boolean> {
    try {
      if (!id) {
        throw new Error("ID do usuário é obrigatório");
      }

      // Verificar se o usuário existe
      const existingUsers = await db
        .select()
        .from(users)
        .where(eq(users.id, BigInt(id)))
        .limit(1);

      const existingUser = existingUsers[0];

      if (!existingUser) {
        throw new Error("Usuário não encontrado");
      }

      // Soft delete - apenas desativar o usuário
      const result = await db
        .update(users)
        .set({
          active: false,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(users.id, BigInt(id)))
        .returning();

      return result.length > 0;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }

  // Método para exclusão permanente (use com cuidado)
  static async hardDelete(id: number): Promise<boolean> {
    try {
      if (!id) {
        throw new Error("ID do usuário é obrigatório");
      }

      const result = await db
        .delete(users)
        .where(eq(users.id, BigInt(id)))
        .returning();

      return result.length > 0;
    } catch (error) {
      console.error("Error hard deleting user:", error);
      throw error;
    }
  }
}
