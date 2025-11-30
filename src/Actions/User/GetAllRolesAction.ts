import { db } from "@/db";
import { roles } from "@/db/schema";

export interface Role {
  id: number;
  name: string;
}

export class GetAllRolesAction {
  static async execute(): Promise<Role[]> {
    try {
      const result = await db
        .select({
          id: roles.id,
          name: roles.name,
        })
        .from(roles);

      return result.map((role) => ({
        id: Number(role.id),
        name: role.name,
      }));
    } catch (error) {
      console.error("Error fetching roles:", error);
      return [];
    }
  }
}
