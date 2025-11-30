import { createClient } from "@/lib/supabase/client";
import { Restaurant } from "@/Contracts/Restaurant";

export class GetFeaturedRestaurantsAction {
  static async execute(limit: number = 4): Promise<Restaurant[]> {
    const supabase = createClient();

    const { data: restaurants, error } = await supabase
      .from("restaurants")
      .select("*")
      .eq("active", true)
      .order("rating_count", { ascending: false })
      .order("stars_rating", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Erro ao buscar restaurantes em destaque:", error);
      throw new Error(
        `Erro ao buscar restaurantes em destaque: ${error.message}`
      );
    }

    return restaurants as Restaurant[];
  }
}
