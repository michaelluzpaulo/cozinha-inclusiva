import { createClient } from "@/lib/supabase/client";
import { Restaurant } from "@/Contracts/Restaurant";

export interface RestaurantWithRating extends Restaurant {
  userRating: number;
  ratingComment?: string;
  ratedAt: string;
}

export class GetUserRatedRestaurantsAction {
  static async execute(clientId: number): Promise<RestaurantWithRating[]> {
    const supabase = createClient();

    try {
      // Buscar restaurantes que o cliente avaliou
      const { data: ratings, error: ratingsError } = await supabase
        .from("restaurant_ratings")
        .select(
          `
          stars,
          comment,
          created_at,
          restaurant_id,
          restaurants (
            id,
            name,
            description,
            img,
            email,
            phone,
            whatsapp,
            site,
            active,
            stars_rating,
            rating_count
          )
        `
        )
        .eq("client_id", clientId)
        .order("created_at", { ascending: false });

      if (ratingsError) {
        console.error(
          "❌ Erro ao buscar restaurantes avaliados:",
          ratingsError
        );
        return [];
      }

      console.log("📊 Ratings encontrados:", ratings?.length || 0);
      console.log("📋 Dados dos ratings:", ratings);

      if (!ratings || ratings.length === 0) {
        console.log("ℹ️ Nenhum rating encontrado para o cliente:", clientId);
        return [];
      }

      // Mapear os dados para o formato esperado
      const ratedRestaurants: RestaurantWithRating[] = ratings
        .filter((rating) => rating.restaurants) // Filtrar apenas ratings com restaurante válido
        .map((rating) => {
          const restaurant = rating.restaurants as any;
          return {
            ...restaurant,
            userRating: rating.stars,
            ratingComment: rating.comment || undefined,
            ratedAt: rating.created_at,
          };
        });

      return ratedRestaurants;
    } catch (error) {
      console.error("Erro ao buscar restaurantes avaliados:", error);
      return [];
    }
  }
}
