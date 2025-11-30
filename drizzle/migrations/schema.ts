import { pgTable, foreignKey, bigserial, bigint, varchar, text, boolean, integer, timestamp, numeric, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const restaurants = pgTable("restaurants", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
	name: varchar({ length: 70 }).notNull(),
	slug: varchar({ length: 150 }).notNull(),
	email: varchar({ length: 150 }),
	phone: varchar({ length: 15 }),
	whatsapp: varchar({ length: 15 }),
	site: varchar({ length: 255 }),
	description: text(),
	active: boolean().default(true),
	showPrice: boolean("show_price").default(true),
	favoritesCount: integer("favorites_count").default(0),
	ratingCount: integer("rating_count").default(0),
	starsRating: integer("stars_rating").default(0),
	img: varchar({ length: 255 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "restaurants_user_id_fkey"
		}).onDelete("cascade"),
]);

export const recipes = pgTable("recipes", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	title: varchar({ length: 150 }).notNull(),
	description: text(),
	img: varchar(),
});

export const clients = pgTable("clients", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({ name: "client_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 9223372036854775807, cache: 1 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
	name: varchar(),
	email: varchar(),
	password: varchar(),
	active: boolean().default(true),
});

export const restrictions = pgTable("restrictions", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	description: text(),
	icon: varchar({ length: 255 }),
});

export const restaurantLocations = pgTable("restaurant_locations", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	restaurantId: bigint("restaurant_id", { mode: "number" }).notNull(),
	cep: varchar({ length: 15 }),
	uf: varchar({ length: 2 }),
	city: varchar({ length: 100 }),
	neighborhood: varchar({ length: 100 }),
	street: varchar({ length: 150 }),
	number: varchar({ length: 20 }),
	mapLat: numeric("map_lat", { precision: 10, scale:  6 }),
	mapLng: numeric("map_lng", { precision: 10, scale:  6 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.restaurantId],
			foreignColumns: [restaurants.id],
			name: "restaurant_locations_restaurant_id_fkey"
		}).onDelete("cascade"),
]);

export const roles = pgTable("roles", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	name: varchar({ length: 50 }).notNull(),
});

export const users = pgTable("users", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	active: boolean().default(true),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	password: varchar({ length: 255 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	roleId: bigint("role_id", { mode: "number" }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [roles.id],
			name: "fk_role"
		}).onDelete("restrict"),
]);

export const recipeRestriction = pgTable("recipe_restriction", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	recipeId: bigint("recipe_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	restrictionId: bigint("restriction_id", { mode: "number" }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.recipeId],
			foreignColumns: [recipes.id],
			name: "recipe_restriction_recipe_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.restrictionId],
			foreignColumns: [restrictions.id],
			name: "recipe_restriction_restriction_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.recipeId, table.restrictionId], name: "recipe_restriction_pkey"}),
]);

export const restaurantRestriction = pgTable("restaurant_restriction", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	restaurantId: bigint("restaurant_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	restrictionId: bigint("restriction_id", { mode: "number" }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.restaurantId],
			foreignColumns: [restaurants.id],
			name: "restaurant_restriction_restaurant_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.restrictionId],
			foreignColumns: [restrictions.id],
			name: "restaurant_restriction_restriction_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.restaurantId, table.restrictionId], name: "restaurant_restriction_pkey"}),
]);

export const clientRecipeFavorites = pgTable("client_recipe_favorites", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	clientId: bigint("client_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	recipeId: bigint("recipe_id", { mode: "number" }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.clientId],
			foreignColumns: [clients.id],
			name: "client_recipe_favorites_client_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.recipeId],
			foreignColumns: [recipes.id],
			name: "client_recipe_favorites_recipe_id_fkey"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.clientId, table.recipeId], name: "client_recipe_favorites_pkey"}),
]);
