import {
  pgTable,
  bigserial,
  varchar,
  boolean,
  timestamp,
  text,
  integer,
  primaryKey,
  bigint,
  numeric,
  foreignKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Baseado no schema do Supabase - Tabela Clients
export const clients = pgTable("clients", {
  id: bigint("id", { mode: "number" })
    .primaryKey()
    .generatedByDefaultAsIdentity({
      name: "client_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      cache: 1,
    }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow(),
  name: varchar("name"),
  email: varchar("email"),
  password: varchar("password"),
  active: boolean("active").default(true),
});

// Baseado no schema do Supabase - Tabela Recipes
export const recipes = pgTable("recipes", {
  id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
  title: varchar("title", { length: 150 }).notNull(),
  description: text("description"),
  img: varchar("img"),
});

// Baseado no schema do Supabase - Tabela Users
export const users = pgTable(
  "users",
  {
    id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 150 }).notNull().unique(),
    active: boolean("active").default(true),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    password: varchar("password", { length: 255 }).notNull(),
    roleId: bigint("role_id", { mode: "number" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.roleId],
      foreignColumns: [roles.id],
      name: "fk_role",
    }).onDelete("restrict"),
  ]
);

// Baseado no schema do Supabase - Tabela Roles
export const roles = pgTable("roles", {
  id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
  name: varchar("name", { length: 50 }).notNull(),
});

// Baseado no schema do Supabase - Tabela Restaurants
export const restaurants = pgTable(
  "restaurants",
  {
    id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
    userId: bigint("user_id", { mode: "number" }).notNull(),
    name: varchar("name", { length: 70 }).notNull(),
    slug: varchar("slug", { length: 150 }).notNull(),
    email: varchar("email", { length: 150 }),
    phone: varchar("phone", { length: 15 }),
    whatsapp: varchar("whatsapp", { length: 15 }),
    site: varchar("site", { length: 255 }),
    description: text("description"),
    active: boolean("active").default(true),
    showPrice: boolean("show_price").default(true),
    favoritesCount: integer("favorites_count").default(0),
    ratingCount: integer("rating_count").default(0),
    starsRating: integer("stars_rating").default(0),
    img: varchar("img", { length: 255 }),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "restaurants_user_id_fkey",
    }).onDelete("cascade"),
  ]
);

// Baseado no schema do Supabase - Tabela Restaurant Locations
export const restaurantLocations = pgTable(
  "restaurant_locations",
  {
    id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
    restaurantId: bigint("restaurant_id", { mode: "number" }).notNull(),
    cep: varchar("cep", { length: 15 }),
    uf: varchar("uf", { length: 2 }),
    city: varchar("city", { length: 100 }),
    neighborhood: varchar("neighborhood", { length: 100 }),
    street: varchar("street", { length: 150 }),
    number: varchar("number", { length: 20 }),
    mapLat: numeric("map_lat", { precision: 10, scale: 6 }),
    mapLng: numeric("map_lng", { precision: 10, scale: 6 }),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string",
    }).defaultNow(),
  },
  (table) => [
    foreignKey({
      columns: [table.restaurantId],
      foreignColumns: [restaurants.id],
      name: "restaurant_locations_restaurant_id_fkey",
    }).onDelete("cascade"),
  ]
);

// Baseado no schema do Supabase - Tabela Restrictions
export const restrictions = pgTable("restrictions", {
  id: bigserial("id", { mode: "bigint" }).primaryKey().notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 255 }),
});

// Baseado no schema do Supabase - Tabela Recipe Restriction (Many-to-Many)
export const recipeRestriction = pgTable(
  "recipe_restriction",
  {
    recipeId: bigint("recipe_id", { mode: "number" }).notNull(),
    restrictionId: bigint("restriction_id", { mode: "number" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.recipeId],
      foreignColumns: [recipes.id],
      name: "recipe_restriction_recipe_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.restrictionId],
      foreignColumns: [restrictions.id],
      name: "recipe_restriction_restriction_id_fkey",
    }).onDelete("cascade"),
    primaryKey({
      columns: [table.recipeId, table.restrictionId],
      name: "recipe_restriction_pkey",
    }),
  ]
);

// Baseado no schema do Supabase - Tabela Restaurant Restriction (Many-to-Many)
export const restaurantRestriction = pgTable(
  "restaurant_restriction",
  {
    restaurantId: bigint("restaurant_id", { mode: "number" }).notNull(),
    restrictionId: bigint("restriction_id", { mode: "number" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.restaurantId],
      foreignColumns: [restaurants.id],
      name: "restaurant_restriction_restaurant_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.restrictionId],
      foreignColumns: [restrictions.id],
      name: "restaurant_restriction_restriction_id_fkey",
    }).onDelete("cascade"),
    primaryKey({
      columns: [table.restaurantId, table.restrictionId],
      name: "restaurant_restriction_pkey",
    }),
  ]
);

// NOVA TABELA - Client Recipe Favorites (Many-to-Many entre Clients e Recipes)
export const clientRecipeFavorites = pgTable(
  "client_recipe_favorites",
  {
    clientId: bigint("client_id", { mode: "number" }).notNull(),
    recipeId: bigint("recipe_id", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.clientId],
      foreignColumns: [clients.id],
      name: "client_recipe_favorites_client_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.recipeId],
      foreignColumns: [recipes.id],
      name: "client_recipe_favorites_recipe_id_fkey",
    }).onDelete("cascade"),
    primaryKey({
      columns: [table.clientId, table.recipeId],
      name: "client_recipe_favorites_pkey",
    }),
  ]
);
// NOVA TABELA - Restaurant Ratings
export const restaurantRatings = pgTable(
  "restaurant_ratings",
  {
    id: bigserial("id", { mode: "number" }).primaryKey().notNull(),
    restaurantId: bigint("restaurant_id", { mode: "number" }).notNull(),
    clientId: bigint("client_id", { mode: "number" }),
    stars: integer("stars").default(5).notNull(),
    comment: text("comment"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.restaurantId],
      foreignColumns: [restaurants.id],
      name: "restaurant_ratings_restaurant_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.clientId],
      foreignColumns: [clients.id],
      name: "restaurant_ratings_client_id_fkey",
    }).onDelete("set null"),
  ]
);

// Definir relacionamentos
export const clientsRelations = relations(clients, ({ many }) => ({
  favorites: many(clientRecipeFavorites),
}));

export const recipesRelations = relations(recipes, ({ many }) => ({
  recipeRestrictions: many(recipeRestriction),
  favorites: many(clientRecipeFavorites),
}));

export const restaurantsRelations = relations(restaurants, ({ many }) => ({
  restaurantRestrictions: many(restaurantRestriction),
}));

export const restrictionsRelations = relations(restrictions, ({ many }) => ({
  recipeRestrictions: many(recipeRestriction),
  restaurantRestrictions: many(restaurantRestriction),
}));

export const recipeRestrictionRelations = relations(
  recipeRestriction,
  ({ one }) => ({
    recipe: one(recipes, {
      fields: [recipeRestriction.recipeId],
      references: [recipes.id],
    }),
    restriction: one(restrictions, {
      fields: [recipeRestriction.restrictionId],
      references: [restrictions.id],
    }),
  })
);

export const restaurantRestrictionRelations = relations(
  restaurantRestriction,
  ({ one }) => ({
    restaurant: one(restaurants, {
      fields: [restaurantRestriction.restaurantId],
      references: [restaurants.id],
    }),
    restriction: one(restrictions, {
      fields: [restaurantRestriction.restrictionId],
      references: [restrictions.id],
    }),
  })
);

export const clientRecipeFavoritesRelations = relations(
  clientRecipeFavorites,
  ({ one }) => ({
    client: one(clients, {
      fields: [clientRecipeFavorites.clientId],
      references: [clients.id],
    }),
    recipe: one(recipes, {
      fields: [clientRecipeFavorites.recipeId],
      references: [recipes.id],
    }),
  })
);
