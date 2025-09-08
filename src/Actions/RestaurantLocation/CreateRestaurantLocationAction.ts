import { createClient } from "@/lib/supabase/client";
import { RestaurantLocation } from "@/Contracts/RestaurantLocation";

export class CreateRestaurantLocationAction {
  static async execute(payload: RestaurantLocation) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("restaurant_locations")
      .insert([payload]);
    if (error) throw error;
    return data;
  }
}
