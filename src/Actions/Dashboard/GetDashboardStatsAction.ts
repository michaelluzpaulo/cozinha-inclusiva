import { createClient } from "@/lib/supabase/client";

export interface DashboardStats {
  totalRestaurants: number;
  totalRecipes: number;
  totalStars: number;
  totalFavorites: number;
}

export class GetDashboardStatsAction {
  static async execute(): Promise<DashboardStats> {
    const supabase = createClient();

    // Buscar total de restaurantes
    const { count: totalRestaurants, error: restaurantsError } = await supabase
      .from("restaurants")
      .select("*", { count: "exact", head: true });

    if (restaurantsError) throw restaurantsError;

    // Buscar total de receitas
    const { count: totalRecipes, error: recipesError } = await supabase
      .from("recipes")
      .select("*", { count: "exact", head: true });

    if (recipesError) throw recipesError;

    // Buscar total de estrelas da tabela restaurant_ratings
    const { data: starsData, error: starsError } = await supabase
      .from("restaurant_ratings")
      .select("stars");

    if (starsError) throw starsError;
    const totalStars =
      starsData?.reduce((sum, rating) => sum + (rating.stars || 0), 0) || 0;

    // Buscar total de favoritos da tabela client_recipe_favorites
    const { count: totalFavorites, error: favoritesError } = await supabase
      .from("client_recipe_favorites")
      .select("*", { count: "exact", head: true });

    if (favoritesError) throw favoritesError;

    return {
      totalRestaurants: totalRestaurants || 0,
      totalRecipes: totalRecipes || 0,
      totalStars,
      totalFavorites: totalFavorites || 0,
    };
  }
}
