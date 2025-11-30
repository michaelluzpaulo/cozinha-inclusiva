import { createClient } from "@/lib/supabase/client";

export interface RestaurantStats {
  totalRatings: number;
  averageStars: number;
  ratingsBreakdown: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export class GetRestaurantStatsAction {
  static async execute(restaurantId: number): Promise<RestaurantStats> {
    const supabase = createClient();

    // Buscar todas as avaliações do restaurante
    const { data: ratings, error } = await supabase
      .from("restaurant_ratings")
      .select("stars")
      .eq("restaurant_id", restaurantId);

    if (error) {
      console.error("Erro ao buscar estatísticas do restaurante:", error);
      return {
        totalRatings: 0,
        averageStars: 0,
        ratingsBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const totalRatings = ratings?.length || 0;

    if (totalRatings === 0) {
      return {
        totalRatings: 0,
        averageStars: 0,
        ratingsBreakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    // Calcular média de estrelas
    const totalStars = ratings.reduce((sum, rating) => sum + rating.stars, 0);
    const averageStars = totalStars / totalRatings;

    // Contar avaliações por estrela
    const ratingsBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach((rating) => {
      if (rating.stars >= 1 && rating.stars <= 5) {
        ratingsBreakdown[rating.stars as keyof typeof ratingsBreakdown]++;
      }
    });

    return {
      totalRatings,
      averageStars: Math.round(averageStars * 10) / 10, // Arredondar para 1 casa decimal
      ratingsBreakdown,
    };
  }
}
