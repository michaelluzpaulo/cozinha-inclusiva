import { createClient } from "@/lib/supabase/client";
import { Recipe } from "@/Contracts/Recipe";
import { RecipeRestriction } from "@/Contracts/RecipeRestriction";

export interface RecipeWithRestrictions extends Recipe {
  restrictions: number[];
}

export class ListRecipesAction {
  static async execute(): Promise<RecipeWithRestrictions[]> {
    const supabase = createClient();
    const { data: recipes, error: recipeError } = await supabase
      .from("recipes")
      .select("*")
      .order("id", { ascending: true });
    if (recipeError) throw recipeError;

    const { data: recipeRestrictions, error: rrError } = await supabase
      .from("recipe_restriction")
      .select("*");
    if (rrError) throw rrError;

    // Mapear restrições para cada receita
    const restrictionsMap: Record<number, number[]> = {};
    (recipeRestrictions as RecipeRestriction[]).forEach((rr) => {
      if (!restrictionsMap[rr.recipe_id]) restrictionsMap[rr.recipe_id] = [];
      restrictionsMap[rr.recipe_id].push(rr.restriction_id);
    });

    return (recipes as Recipe[]).map((r) => ({
      ...r,
      restrictions: restrictionsMap[r.id!] || [],
    }));
  }
}
