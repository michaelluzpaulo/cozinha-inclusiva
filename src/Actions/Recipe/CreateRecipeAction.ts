import { createClient } from "@/lib/supabase/client";
import { Recipe } from "@/Contracts/Recipe";

export class CreateRecipeAction {
  static async execute(
    recipe: Omit<Recipe, "id">,
    restrictions: number[]
  ): Promise<number> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("recipes")
      .insert([recipe])
      .select("id")
      .single();
    if (error) throw error;
    const recipeId = data.id;
    if (restrictions.length > 0) {
      const rrData = restrictions.map((restriction_id) => ({
        recipe_id: recipeId,
        restriction_id,
      }));
      const { error: rrError } = await supabase
        .from("recipe_restriction")
        .insert(rrData);
      if (rrError) throw rrError;
    }
    return recipeId;
  }
}
