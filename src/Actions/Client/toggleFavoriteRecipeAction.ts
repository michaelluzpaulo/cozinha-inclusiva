"use server";

import { db } from "@/db";
import { clientRecipeFavorites } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export interface ToggleFavoriteResult {
  success: boolean;
  isFavorited: boolean;
  message: string;
}

// Server Action para alternar favorito de receita
export async function toggleFavoriteRecipeAction(
  clientId: number,
  recipeId: number
): Promise<ToggleFavoriteResult> {
  try {
    console.log(
      `🔄 Toggle favorite - Client: ${clientId}, Recipe: ${recipeId}`
    );

    // Verificar se já existe o favorito
    const [existingFavorite] = await db
      .select()
      .from(clientRecipeFavorites)
      .where(
        and(
          eq(clientRecipeFavorites.clientId, clientId),
          eq(clientRecipeFavorites.recipeId, recipeId)
        )
      )
      .limit(1);

    if (existingFavorite) {
      // Se existe, remover dos favoritos
      await db
        .delete(clientRecipeFavorites)
        .where(
          and(
            eq(clientRecipeFavorites.clientId, clientId),
            eq(clientRecipeFavorites.recipeId, recipeId)
          )
        );

      console.log("❌ Receita removida dos favoritos");
      return {
        success: true,
        isFavorited: false,
        message: "Receita removida dos favoritos",
      };
    } else {
      // Se não existe, adicionar aos favoritos
      await db.insert(clientRecipeFavorites).values({
        clientId,
        recipeId,
      });

      console.log("❤️ Receita adicionada aos favoritos");
      return {
        success: true,
        isFavorited: true,
        message: "Receita adicionada aos favoritos",
      };
    }
  } catch (error) {
    console.error("❌ Erro ao alternar favorito:", error);
    return {
      success: false,
      isFavorited: false,
      message: "Erro ao processar favorito. Tente novamente.",
    };
  }
}

// Server Action para buscar todos os favoritos do usuário
export async function getUserFavoritesAction(
  clientId: number
): Promise<number[]> {
  try {
    const userFavorites = await db
      .select({ recipeId: clientRecipeFavorites.recipeId })
      .from(clientRecipeFavorites)
      .where(eq(clientRecipeFavorites.clientId, clientId));

    return userFavorites.map((fav) => fav.recipeId);
  } catch (error) {
    console.error("❌ Erro ao buscar favoritos do usuário:", error);
    return [];
  }
}

// Server Action para verificar se receita é favorita
export async function checkIsFavoriteAction(
  clientId: number,
  recipeId: number
): Promise<boolean> {
  try {
    const [existingFavorite] = await db
      .select()
      .from(clientRecipeFavorites)
      .where(
        and(
          eq(clientRecipeFavorites.clientId, clientId),
          eq(clientRecipeFavorites.recipeId, recipeId)
        )
      )
      .limit(1);

    return !!existingFavorite;
  } catch (error) {
    console.error("❌ Erro ao verificar favorito:", error);
    return false;
  }
}
