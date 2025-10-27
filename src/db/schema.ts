import {
  pgTable,
  bigserial,
  varchar,
  boolean,
  timestamp,
  text,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Tabela Clients
export const clients = pgTable("clients", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Tabela Recipes
export const recipes = pgTable("recipes", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  img: varchar("img", { length: 500 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Tabela Restaurants
export const restaurants = pgTable("restaurants", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  address: varchar("address", { length: 500 }),
  phone: varchar("phone", { length: 20 }),
  email: varchar("email", { length: 255 }),
  img: varchar("img", { length: 500 }),
  description: text("description"),
  starsRating: integer("stars_rating").default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Tabela Restrictions
export const restrictions = pgTable("restrictions", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

// Tabela de relacionamento Recipe-Restriction (Many-to-Many)
export const recipeRestriction = pgTable("recipe_restriction", {
  recipeId: integer("recipe_id")
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" }),
  restrictionId: integer("restriction_id")
    .notNull()
    .references(() => restrictions.id, { onDelete: "cascade" }),
});

// Tabela de relacionamento Restaurant-Restriction (Many-to-Many)
export const restaurantRestriction = pgTable("restaurant_restriction", {
  restaurantId: integer("restaurant_id")
    .notNull()
    .references(() => restaurants.id, { onDelete: "cascade" }),
  restrictionId: integer("restriction_id")
    .notNull()
    .references(() => restrictions.id, { onDelete: "cascade" }),
});

// Definir relacionamentos
export const recipesRelations = relations(recipes, ({ many }) => ({
  recipeRestrictions: many(recipeRestriction),
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
