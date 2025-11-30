import { db } from "@/db";
import { User } from "@/Contracts/User";
import { users, roles } from "@/db/schema";
import { eq } from "drizzle-orm";

interface GetAllUsersParams {
  active?: boolean;
  limit?: number;
  offset?: number;
}

export class GetAllUsersAction {
  static async execute(params: GetAllUsersParams = {}): Promise<User[]> {
    try {
      const { active, limit = 50, offset = 0 } = params;

      const query = db
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
        .limit(limit)
        .offset(offset);

      const result =
        active !== undefined
          ? await query.where(eq(users.active, active))
          : await query;

      return result.map((user) => ({
        id: Number(user.id),
        name: user.name,
        email: user.email || "",
        active: user.active,
        role_id: user.roleId,
        created_at: user.createdAt,
        updated_at: user.updatedAt,
        password: "", // Não retornar senha
        roleName: user.roleName,
      })) as User[];
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  }
}
