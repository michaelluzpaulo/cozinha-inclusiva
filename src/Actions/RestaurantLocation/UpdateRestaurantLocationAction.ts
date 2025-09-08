import { createClient } from "@/lib/supabase/client";
import { RestaurantLocation } from "@/Contracts/RestaurantLocation";

export class UpdateRestaurantLocationAction {
  static async execute(id: number, payload: Partial<RestaurantLocation>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("restaurant_locations")
      .update(payload)
      .eq("id", id);
    if (error) throw error;
    return data;
  }
}
