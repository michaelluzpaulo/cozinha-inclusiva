import { createClient } from "@/lib/supabase/client";
import { Restriction } from "@/Contracts/Restriction";

export class CreateRestrictionAction {
  static async execute(
    restriction: Omit<Restriction, "id">
  ): Promise<Restriction> {
    const supabase = createClient();
    const payload = {
      ...restriction,
      icon: restriction.icon ? restriction.icon : null,
      description: restriction.description ? restriction.description : null,
    };
    const { data, error } = await supabase
      .from("restrictions")
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data as Restriction;
  }
}
