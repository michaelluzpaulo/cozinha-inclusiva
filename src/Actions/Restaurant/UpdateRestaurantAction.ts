import { createClient } from "@/lib/supabase/client";
import { Restaurant } from "@/Contracts/Restaurant";

export class UpdateRestaurantAction {
  static async execute(id: number, payload: Partial<Restaurant>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("restaurants")
      .update(payload)
      .eq("id", id);
    if (error) throw error;
    return data;
  }
}
