import { db } from "@/db";
import { RestaurantRating } from "@/Contracts/RestaurantRating";
import { restaurantRatings } from "@/db/schema";

interface CreateRestaurantRatingParams {
  restaurantId: number;
  clientId?: number | null; // Opcional por enquanto, até implementarmos autenticação
  rating: number;
  comment?: string | null;
}

export class CreateRestaurantRatingAction {
  static async execute(
    params: CreateRestaurantRatingParams
  ): Promise<RestaurantRating | null> {
    try {
      const { restaurantId, clientId, rating, comment } = params;

      // Validações
      if (!restaurantId || rating < 1 || rating > 5) {
        throw new Error("Dados inválidos para criação da avaliação");
      }

      const newRating = await db
        .insert(restaurantRatings)
        .values({
          restaurantId: restaurantId,
          clientId: clientId,
          stars: rating,
          comment: comment || null,
        })
        .returning();

      return newRating[0];
    } catch (error) {
      console.error("Error creating restaurant rating:", error);
      throw error;
    }
  }
}
