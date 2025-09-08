import { createClient } from "@/lib/supabase/client";
import { Restaurant } from "@/Contracts/Restaurant";

export class ListRestaurantsAction {
  static async execute(): Promise<Restaurant[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("restaurants")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as Restaurant[];
  }
}
