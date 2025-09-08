import { createClient } from "@/lib/supabase/client";
import { Restriction } from "@/Contracts/Restriction";

export class UpdateRestrictionAction {
  static async execute(
    id: number,
    updates: Partial<Restriction>
  ): Promise<Restriction> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("restrictions")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as Restriction;
  }
}
