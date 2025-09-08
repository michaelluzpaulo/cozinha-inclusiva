import { createClient } from "@/lib/supabase/client";
import { Restriction } from "@/Contracts/Restriction";

export class FindRestrictionAction {
  static async execute(id: number): Promise<Restriction | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("restrictions")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data as Restriction;
  }
}
