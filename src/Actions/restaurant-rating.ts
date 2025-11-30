"use server";

import { CreateRestaurantRatingAction } from "@/Actions/RestaurantRating/CreateRestaurantRatingAction";
import { redirect } from "next/navigation";

export async function createRestaurantRating(formData: FormData) {
  const restaurantId = Number(formData.get("restaurantId"));
  const rating = Number(formData.get("rating"));
  const comment = formData.get("comment") as string;

  try {
    // Validações
    if (!restaurantId || !rating || rating < 1 || rating > 5) {
      throw new Error(
        "Dados inválidos. O restaurante e avaliação (1-5) são obrigatórios."
      );
    }

    // Criar a recomendação usando a Action
    const newRating = await CreateRestaurantRatingAction.execute({
      restaurantId,
      clientId: null, // Por enquanto null até implementarmos autenticação
      rating,
      comment: comment?.trim() || null,
    });

    console.log("Recomendação criada:", newRating);

    // Redirecionar de volta para a página do restaurante
    redirect(`/restaurante/${restaurantId}`);
  } catch (error) {
    console.error("Erro ao criar recomendação:", error);
    throw error;
  }
}
