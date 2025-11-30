import { createClient } from "@/lib/supabase/client";

export interface RecipeFavorite {
  id: number;
  recipe_id: number;
  client_id: number;
  created_at?: string;
}

export class GetRecipeFavoritesAction {
  static async execute(recipeId: number): Promise<number> {
    const supabase = createClient();

    const { count, error } = await supabase
      .from("client_recipe_favorites")
      .select("*", { count: "exact", head: true })
      .eq("recipe_id", recipeId);

    if (error) {
      console.error("Erro ao buscar favoritos da receita:", error);
      return 0;
    }

    return count || 0;
  }
}
