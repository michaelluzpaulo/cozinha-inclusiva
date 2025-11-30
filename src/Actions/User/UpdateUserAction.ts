import { db } from "@/db";
import { User } from "@/Contracts/User";
import { users } from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";
import bcrypt from "bcryptjs";

interface UpdateUserParams {
  id: number;
  name?: string;
  email?: string;
  password?: string;
  roleId?: number;
  active?: boolean;
}

export class UpdateUserAction {
  static async execute(params: UpdateUserParams): Promise<User | null> {
    try {
      const { id, name, email, password, roleId, active } = params;

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

      // Se email foi alterado, verificar se já existe
      if (email && email !== existingUser.email) {
        const emailExistsResult = await db
          .select()
          .from(users)
          .where(and(eq(users.email, email), ne(users.id, BigInt(id))))
          .limit(1);

        const emailExists = emailExistsResult[0];

        if (emailExists) {
          throw new Error("E-mail já está sendo usado por outro usuário");
        }
      }

      // Preparar dados para update
      const updateData: any = {
        updatedAt: new Date().toISOString(),
      };

      if (name !== undefined) updateData.name = name;
      if (email !== undefined) updateData.email = email;
      if (roleId !== undefined) updateData.roleId = roleId;
      if (active !== undefined) updateData.active = active;

      // Hash da nova senha se fornecida
      if (password) {
        updateData.password = await bcrypt.hash(password, 12);
      }

      const updatedUser = await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, BigInt(id)))
        .returning();

      const user = updatedUser[0];
      return {
        id: Number(user.id),
        name: user.name,
        email: user.email,
        active: user.active,
        role_id: user.roleId,
        roleId: user.roleId,
        created_at: user.createdAt,
        createdAt: user.createdAt,
        updated_at: user.updatedAt,
        updatedAt: user.updatedAt,
      } as User;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }
}
