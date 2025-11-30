import { createClient } from "@/lib/supabase/client";

export interface Recipe {
  id: number;
  title: string;
  description?: string;
  img?: string;
  favorites_count?: number;
}

export class GetFeaturedRecipesAction {
  static async execute(limit: number = 4): Promise<Recipe[]> {
    const supabase = createClient();

    // Buscar receitas com imagem (ordenar por ID desc para pegar as mais recentes)
    const { data: recipes, error } = await supabase
      .from("recipes")
      .select("id, title, description, img")
      .not("img", "is", null)
      .neq("img", "")
      .order("id", { ascending: false })
      .limit(limit);
    if (error) {
      console.error("Erro ao buscar receitas em destaque:", error);
      throw new Error(`Erro ao buscar receitas em destaque: ${error.message}`);
    }

    console.log("✅ Receitas encontradas:", recipes);

    // Se não há receitas, retorna array vazio
    if (!recipes || recipes.length === 0) {
      return [];
    }

    // Para cada receita, buscar a quantidade de favoritos na tabela client_recipe_favorites
    try {
      const recipesWithFavorites = await Promise.all(
        recipes.map(async (recipe) => {
          const { count, error: countError } = await supabase
            .from("client_recipe_favorites")
            .select("*", { count: "exact", head: true })
            .eq("recipe_id", recipe.id);

          if (countError) {
            console.warn(
              `Erro ao contar favoritos para receita ${recipe.id}:`,
              countError
            );
            return {
              ...recipe,
              favorites_count: 0,
            };
          }

          return {
            ...recipe,
            favorites_count: count || 0,
          };
        })
      );

      return recipesWithFavorites as Recipe[];
    } catch (favoriteError) {
      console.warn(
        "Erro ao buscar favoritos, retornando receitas sem contagem:",
        favoriteError
      );
      // Se houver erro ao buscar favoritos, retorna as receitas sem a contagem
      return recipes.map((recipe) => ({
        ...recipe,
        favorites_count: 0,
      })) as Recipe[];
    }
  }
}
