import { createClient } from "@/lib/supabase/client";

export class DeleteRestaurantRestrictionAction {
  static async execute(restaurant_id: number) {
    const supabase = createClient();
    const { error } = await supabase
      .from("restaurant_restriction")
      .delete()
      .eq("restaurant_id", restaurant_id);
    if (error) throw error;
  }
}
