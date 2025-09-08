import { createClient } from "@/lib/supabase/client";

export class DeleteRestrictionAction {
  static async execute(id: number): Promise<void> {
    const supabase = createClient();
    const { error } = await supabase.from("restrictions").delete().eq("id", id);
    if (error) throw error;
  }
}
