import { createClient } from "@/lib/supabase/client";

export class DeleteRestaurantAction {
  static async execute(id: number) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("restaurants")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return data;
  }
}
