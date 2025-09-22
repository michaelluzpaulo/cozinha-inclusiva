import { createClient } from "@/lib/supabase/client";
import { Restaurant } from "@/Contracts/Restaurant";
import { RestaurantRestriction } from "@/Contracts/RestaurantRestriction";

export interface RestaurantWithRestrictions extends Restaurant {
  restrictions: number[];
}

export class ListRestaurantsAction {
  static async execute(): Promise<RestaurantWithRestrictions[]> {
    const supabase = createClient();
    const { data: restaurants, error: restaurantError } = await supabase
      .from("restaurants")
      .select("*")
      .order("created_at", { ascending: false });
    if (restaurantError) throw restaurantError;

    const { data: restaurantRestrictions, error: rrError } = await supabase
      .from("restaurant_restriction")
      .select("*");
    if (rrError) throw rrError;

    // Mapear restrições para cada restaurante
    const restrictionsMap: Record<number, number[]> = {};
    (restaurantRestrictions as RestaurantRestriction[]).forEach((rr) => {
      if (!restrictionsMap[rr.restaurant_id])
        restrictionsMap[rr.restaurant_id] = [];
      restrictionsMap[rr.restaurant_id].push(rr.restriction_id);
    });

    return (restaurants as Restaurant[]).map((r) => ({
      ...r,
      restrictions: restrictionsMap[r.id!] || [],
    }));
  }
}
