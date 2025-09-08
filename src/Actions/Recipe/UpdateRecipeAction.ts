import { createClient } from "@/lib/supabase/client";
import { Recipe } from "@/Contracts/Recipe";

export class UpdateRecipeAction {
  static async execute(recipe: Recipe, restrictions: number[]): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from("recipes")
      .update({
        title: recipe.title,
        description: recipe.description,
      })
      .eq("id", recipe.id);
    if (error) throw error;

    // Atualizar restrições: remover todas e inserir as novas
    const { error: deleteError } = await supabase
      .from("recipe_restriction")
      .delete()
      .eq("recipe_id", recipe.id);
    if (deleteError) throw deleteError;
    if (restrictions.length > 0) {
      const rrData = restrictions.map((restriction_id) => ({
        recipe_id: recipe.id,
        restriction_id,
      }));
      const { error: rrError } = await supabase
        .from("recipe_restriction")
        .insert(rrData);
      if (rrError) throw rrError;
    }
  }
}
