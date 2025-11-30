import { relations } from "drizzle-orm/relations";
import { users, restaurants, restaurantLocations, roles, recipes, recipeRestriction, restrictions, restaurantRestriction, clients, clientRecipeFavorites } from "./schema";

export const restaurantsRelations = relations(restaurants, ({one, many}) => ({
	user: one(users, {
		fields: [restaurants.userId],
		references: [users.id]
	}),
	restaurantLocations: many(restaurantLocations),
	restaurantRestrictions: many(restaurantRestriction),
}));

export const usersRelations = relations(users, ({one, many}) => ({
	restaurants: many(restaurants),
	role: one(roles, {
		fields: [users.roleId],
		references: [roles.id]
	}),
}));

export const restaurantLocationsRelations = relations(restaurantLocations, ({one}) => ({
	restaurant: one(restaurants, {
		fields: [restaurantLocations.restaurantId],
		references: [restaurants.id]
	}),
}));

export const rolesRelations = relations(roles, ({many}) => ({
	users: many(users),
}));

export const recipeRestrictionRelations = relations(recipeRestriction, ({one}) => ({
	recipe: one(recipes, {
		fields: [recipeRestriction.recipeId],
		references: [recipes.id]
	}),
	restriction: one(restrictions, {
		fields: [recipeRestriction.restrictionId],
		references: [restrictions.id]
	}),
}));

export const recipesRelations = relations(recipes, ({many}) => ({
	recipeRestrictions: many(recipeRestriction),
	clientRecipeFavorites: many(clientRecipeFavorites),
}));

export const restrictionsRelations = relations(restrictions, ({many}) => ({
	recipeRestrictions: many(recipeRestriction),
	restaurantRestrictions: many(restaurantRestriction),
}));

export const restaurantRestrictionRelations = relations(restaurantRestriction, ({one}) => ({
	restaurant: one(restaurants, {
		fields: [restaurantRestriction.restaurantId],
		references: [restaurants.id]
	}),
	restriction: one(restrictions, {
		fields: [restaurantRestriction.restrictionId],
		references: [restrictions.id]
	}),
}));

export const clientRecipeFavoritesRelations = relations(clientRecipeFavorites, ({one}) => ({
	client: one(clients, {
		fields: [clientRecipeFavorites.clientId],
		references: [clients.id]
	}),
	recipe: one(recipes, {
		fields: [clientRecipeFavorites.recipeId],
		references: [recipes.id]
	}),
}));

export const clientsRelations = relations(clients, ({many}) => ({
	clientRecipeFavorites: many(clientRecipeFavorites),
}));