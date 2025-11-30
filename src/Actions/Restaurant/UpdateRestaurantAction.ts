import { createClient } from "@/lib/supabase/client";
import { Restaurant } from "@/Contracts/Restaurant";

export class UpdateRestaurantAction {
  static async execute(id: number, payload: Partial<Restaurant>) {
    console.log("🔧 UpdateRestaurantAction - ID:", id);
    console.log("🔧 UpdateRestaurantAction - Payload:", payload);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("restaurants")
      .update(payload)
      .eq("id", id)
      .select();

    console.log("🔧 UpdateRestaurantAction - Resultado:", { data, error });

    if (error) throw error;
    return data;
  }
}
