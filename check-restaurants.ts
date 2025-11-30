import { config } from "dotenv";
config();

import { db } from "@/db";
import { restaurants } from "@/db/schema";

async function checkRestaurants() {
  console.log("🔍 Verificando restaurantes existentes...");

  try {
    const allRestaurants = await db
      .select({ id: restaurants.id, name: restaurants.name })
      .from(restaurants);

    console.log("📋 Restaurantes encontrados:");
    allRestaurants.forEach((restaurant) => {
      console.log(`  ID: ${restaurant.id} - Nome: ${restaurant.name}`);
    });

    console.log(`\n📊 Total: ${allRestaurants.length} restaurantes`);

    return allRestaurants;
  } catch (error) {
    console.error("❌ Erro:", error);
    return [];
  }
}

checkRestaurants().then(() => process.exit(0));
