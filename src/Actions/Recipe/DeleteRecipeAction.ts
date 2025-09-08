import { createClient } from "@/lib/supabase/client";

export class DeleteRecipeAction {
  static async execute(id: number): Promise<void> {
    const supabase = createClient();
    // Remove as restrições vinculadas
    await supabase.from("recipe_restrictions").delete().eq("recipe_id", id);
    // Remove a receita
    const { error } = await supabase.from("recipes").delete().eq("id", id);
    if (error) throw error;
  }
}
