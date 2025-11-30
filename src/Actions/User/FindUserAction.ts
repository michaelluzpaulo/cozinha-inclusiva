import { db } from "@/db";
import { User } from "@/Contracts/User";
import { users, roles } from "@/db/schema";
import { eq } from "drizzle-orm";

export class FindUserAction {
  static async execute(id: number): Promise<User | null> {
    try {
      if (!id) {
        throw new Error("ID do usuário é obrigatório");
      }

      const result = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          active: users.active,
          roleId: users.roleId,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
          roleName: roles.name,
        })
        .from(users)
        .leftJoin(roles, eq(users.roleId, roles.id))
        .where(eq(users.id, BigInt(id)))
        .limit(1);

      if (result.length === 0) {
        return null;
      }

      const user = result[0];
      return {
        id: Number(user.id),
        name: user.name,
        email: user.email || "",
        active: user.active,
        role_id: user.roleId,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
        password: "", // Não retornar senha
        roleName: user.roleName,
      } as User;
    } catch (error) {
      console.error("Error finding user:", error);
      return null;
    }
  }
}
