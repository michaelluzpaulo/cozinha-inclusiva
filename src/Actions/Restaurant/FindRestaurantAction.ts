import { createClient } from "@/lib/supabase/client";
import { Restaurant } from "@/Contracts/Restaurant";

export class FindRestaurantAction {
  static async execute(id: number): Promise<Restaurant> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("restaurants")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as Restaurant;
  }
}
