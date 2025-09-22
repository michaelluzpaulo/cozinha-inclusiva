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
        img: recipe.img,
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

  // Método para atualizar apenas a imagem da receita
  static async updateImage(recipeId: number, imageUrl: string): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase
      .from("recipes")
      .update({ img: imageUrl })
      .eq("id", recipeId);
    if (error) throw error;
  }
}
