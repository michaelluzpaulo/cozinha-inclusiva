import { createClient } from "@/lib/supabase/client";
import { Restriction } from "@/Contracts/Restriction";

export class ListRestrictionsAction {
  static async execute(): Promise<Restriction[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("restrictions")
      .select("*")
      .order("id", { ascending: true });
    if (error) throw error;
    return data as Restriction[];
  }
}
