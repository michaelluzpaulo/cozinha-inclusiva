import { db } from "@/db";
import { RestaurantRating } from "@/Contracts/RestaurantRating";
import { restaurantRatings } from "@/db/schema";
import { eq } from "drizzle-orm";

export class GetRestaurantRatingsAction {
  static async execute(restaurantId: number): Promise<RestaurantRating[]> {
    try {
      if (!restaurantId) {
        throw new Error("Restaurant ID is required");
      }

      const ratings = await db
        .select()
        .from(restaurantRatings)
        .where(eq(restaurantRatings.restaurantId, restaurantId))
        .orderBy(restaurantRatings.createdAt);

      return ratings;
    } catch (error) {
      console.error("Error fetching restaurant ratings:", error);
      return [];
    }
  }
}
