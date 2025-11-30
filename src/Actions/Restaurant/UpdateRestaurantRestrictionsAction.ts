import { createClient } from "@/lib/supabase/client";

export class UpdateRestaurantRestrictionsAction {
  static async execute(
    restaurantId: number,
    restrictionIds: number[]
  ): Promise<void> {
    console.log(
      "🔧 UpdateRestaurantRestrictionsAction - Restaurant ID:",
      restaurantId
    );
    console.log(
      "🔧 UpdateRestaurantRestrictionsAction - Restriction IDs:",
      restrictionIds
    );

    const supabase = createClient();

    // Primeiro, remove todas as restrictions existentes do restaurante
    const { error: deleteError } = await supabase
      .from("restaurant_restriction")
      .delete()
      .eq("restaurant_id", restaurantId);

    if (deleteError) {
      console.error("❌ Erro ao deletar restrictions:", deleteError);
      throw new Error(
        `Erro ao remover restrições existentes: ${deleteError.message}`
      );
    }

    // Se não há restrictions para adicionar, para aqui
    if (!restrictionIds || restrictionIds.length === 0) {
      console.log("✅ Nenhuma restriction para adicionar");
      return;
    }

    // Insere as novas restrictions
    const restrictionData = restrictionIds.map((restrictionId) => ({
      restaurant_id: restaurantId,
      restriction_id: restrictionId,
    }));

    console.log("🔧 Dados das restrictions a inserir:", restrictionData);

    const { data, error: insertError } = await supabase
      .from("restaurant_restriction")
      .insert(restrictionData)
      .select();

    console.log("🔧 UpdateRestaurantRestrictionsAction - Resultado:", {
      data,
      error: insertError,
    });

    if (insertError) {
      console.error("❌ Erro ao inserir restrictions:", insertError);
      throw new Error(`Erro ao adicionar restrições: ${insertError.message}`);
    }

    console.log("✅ Restrictions atualizadas com sucesso");
  }
}
