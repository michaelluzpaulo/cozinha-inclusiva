import { createClient } from "@/lib/supabase/client";

export interface Recipe {
  id: number;
  title: string;
  description?: string;
  img?: string;
}

export class FindRecipeAction {
  static async execute(id: number): Promise<Recipe | null> {
    const supabase = createClient();

    const { data: recipe, error } = await supabase
      .from("recipes")
      .select("id, title, description, img")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Erro ao buscar receita:", error);
      return null;
    }

    return recipe as Recipe;
  }
}
