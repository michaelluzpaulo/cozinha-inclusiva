import { db } from "@/db";
import { User } from "@/Contracts/User";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

interface CreateUserParams {
  name: string;
  email: string;
  password: string;
  roleId: number;
  active?: boolean;
}

export class CreateUserAction {
  static async execute(params: CreateUserParams): Promise<User | null> {
    try {
      const { name, email, password, roleId, active = true } = params;

      // Validações
      if (!name || !email || !password || !roleId) {
        throw new Error("Todos os campos obrigatórios devem ser preenchidos");
      }

      // Verificar se o email já existe
      const existingUsers = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      const existingUser = existingUsers[0];

      if (existingUser) {
        throw new Error("E-mail já cadastrado");
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = await db
        .insert(users)
        .values({
          name,
          email,
          password: hashedPassword,
          roleId,
          active,
        })
        .returning();

      const user = newUser[0];
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
      console.error("Error creating user:", error);
      throw error;
    }
  }
}
