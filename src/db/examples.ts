// Exemplos de como usar Drizzle ORM com as actions existentes
import { db } from "./index";
import {
  recipes,
  restaurants,
  restrictions,
  recipeRestriction,
  restaurantRestriction,
} from "./schema";
import { eq, ilike, and, inArray } from "drizzle-orm";

// Exemplo: Buscar todas as receitas com suas restrições
export async function getRecipesWithRestrictions() {
  return await db
    .select({
      id: recipes.id,
      title: recipes.title,
      description: recipes.description,
      img: recipes.img,
      createdAt: recipes.createdAt,
      restriction: {
        id: restrictions.id,
        name: restrictions.name,
      },
    })
    .from(recipes)
    .leftJoin(recipeRestriction, eq(recipes.id, recipeRestriction.recipeId))
    .leftJoin(
      restrictions,
      eq(recipeRestriction.restrictionId, restrictions.id)
    );
}

// Exemplo: Buscar restaurantes com filtros
export async function getRestaurantsWithFilters(filters: {
  name?: string;
  restrictionIds?: number[];
  minRating?: number;
}) {
  const conditions = [];

  if (filters.name) {
    conditions.push(ilike(restaurants.name, `%${filters.name}%`));
  }

  if (filters.minRating) {
    conditions.push(eq(restaurants.starsRating, filters.minRating));
  }

  if (filters.restrictionIds && filters.restrictionIds.length > 0) {
    // Subconsulta para restaurantes que têm as restrições especificadas
    const restaurantIds = db
      .select({ restaurantId: restaurantRestriction.restaurantId })
      .from(restaurantRestriction)
      .where(
        inArray(restaurantRestriction.restrictionId, filters.restrictionIds)
      );

    conditions.push(inArray(restaurants.id, restaurantIds));
  }

  const query = db
    .select({
      id: restaurants.id,
      name: restaurants.name,
      address: restaurants.address,
      phone: restaurants.phone,
      email: restaurants.email,
      img: restaurants.img,
      description: restaurants.description,
      starsRating: restaurants.starsRating,
      createdAt: restaurants.createdAt,
    })
    .from(restaurants);

  if (conditions.length > 0) {
    return await query.where(and(...conditions));
  }

  return await query;
}

// Exemplo: Criar nova receita com restrições
export async function createRecipeWithRestrictions(
  recipeData: {
    title: string;
    description?: string;
    img?: string;
  },
  restrictionIds: number[]
) {
  return await db.transaction(async (tx) => {
    // Inserir receita
    const [newRecipe] = await tx.insert(recipes).values(recipeData).returning();

    // Inserir restrições da receita
    if (restrictionIds.length > 0) {
      await tx.insert(recipeRestriction).values(
        restrictionIds.map((restrictionId) => ({
          recipeId: newRecipe.id,
          restrictionId,
        }))
      );
    }

    return newRecipe;
  });
}
