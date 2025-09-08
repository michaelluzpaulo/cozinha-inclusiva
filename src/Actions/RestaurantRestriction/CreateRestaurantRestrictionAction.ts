import { createClient } from "@/lib/supabase/client";
import { RestaurantRestriction } from "@/Contracts/RestaurantRestriction";

export class CreateRestaurantRestrictionAction {
  static async execute(restaurant_id: number, restrictions: number[]) {
    const supabase = createClient();
    if (!restrictions.length) return;
    const data = restrictions.map((restriction_id) => ({
      restaurant_id,
      restriction_id,
    }));
    const { error } = await supabase
      .from("restaurant_restriction")
      .insert(data);
    if (error) throw error;
  }
}
