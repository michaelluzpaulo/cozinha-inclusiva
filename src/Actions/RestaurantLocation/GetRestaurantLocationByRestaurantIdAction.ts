import { createClient } from "@/lib/supabase/client";
import { RestaurantLocation } from "@/Contracts/RestaurantLocation";

export class GetRestaurantLocationByRestaurantIdAction {
  static async execute(
    restaurant_id: number
  ): Promise<RestaurantLocation | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("restaurant_locations")
      .select("*")
      .eq("restaurant_id", restaurant_id)
      .single();
    if (error || !data) return null;
    return data as RestaurantLocation;
  }
}
