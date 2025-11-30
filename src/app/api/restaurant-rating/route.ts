import { NextRequest, NextResponse } from "next/server";
import { CreateRestaurantRatingAction } from "@/Actions/RestaurantRating/CreateRestaurantRatingAction";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { restaurantId, rating, comment, clientId } = body;

    // Validações básicas
    if (!restaurantId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        {
          error:
            "Dados inválidos. O restaurante e avaliação (1-5) são obrigatórios.",
        },
        { status: 400 }
      );
    }

    // Verificar se clientId foi fornecido
    if (!clientId) {
      return NextResponse.json(
        {
          error: "É necessário estar logado para avaliar um restaurante.",
        },
        { status: 401 }
      );
    }

    console.log("Criando recomendação com dados:", {
      restaurantId: Number(restaurantId),
      rating: Number(rating),
      comment: comment || null,
      clientId: Number(clientId),
    });

    const newRating = await CreateRestaurantRatingAction.execute({
      restaurantId: Number(restaurantId),
      clientId: Number(clientId),
      rating: Number(rating),
      comment: comment || null,
    });

    console.log("Recomendação criada com sucesso:", newRating);

    return NextResponse.json({
      message: "Recomendação criada com sucesso!",
      data: newRating,
    });
  } catch (error) {
    console.error("Error creating restaurant rating:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
