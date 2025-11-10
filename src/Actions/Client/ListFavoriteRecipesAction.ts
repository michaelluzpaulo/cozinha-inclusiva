"use server";

import { db } from "@/db";
import { clientRecipeFavorites, recipes } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface FavoriteRecipe {
  id: number;
  title: string;
  description: string | null;
  img: string | null;
  createdAt: string | null;
}

// Server Action para buscar receitas favoritas do usuário logado
export async function listFavoriteRecipesAction(
  clientId: number
): Promise<FavoriteRecipe[]> {
  try {
    console.log(`🔍 Buscando receitas favoritas do cliente: ${clientId}`);

    const favoriteRecipes = await db
      .select({
        id: recipes.id,
        title: recipes.title,
        description: recipes.description,
        img: recipes.img,
        createdAt: clientRecipeFavorites.createdAt,
      })
      .from(clientRecipeFavorites)
      .innerJoin(recipes, eq(clientRecipeFavorites.recipeId, recipes.id))
      .where(eq(clientRecipeFavorites.clientId, clientId))
      .orderBy(recipes.title); // Ordem alfabética

    console.log(`✅ Encontradas ${favoriteRecipes.length} receitas favoritas`);

    // Converter bigint para number
    return favoriteRecipes.map((recipe) => ({
      id: Number(recipe.id),
      title: recipe.title,
      description: recipe.description,
      img: recipe.img,
      createdAt: recipe.createdAt,
    }));
  } catch (error) {
    console.error("❌ Erro ao buscar receitas favoritas:", error);
    return [];
  }
}
