import { createClient } from "@/lib/supabase/client";

export class ListRestaurantRestrictionsAction {
  static async execute(restaurant_id: number): Promise<number[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("restaurant_restriction")
      .select("restriction_id")
      .eq("restaurant_id", restaurant_id);
    if (error) throw error;
    return (data || []).map((r: any) => r.restriction_id);
  }
}
