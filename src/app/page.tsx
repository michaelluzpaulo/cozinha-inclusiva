"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import HeaderMenu from "@/components/HeaderMenu";
import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import { FaStar, FaHeart } from "react-icons/fa";
import { GetFeaturedRestaurantsAction } from "@/Actions/Restaurant/GetFeaturedRestaurantsAction";
import { Restaurant } from "@/Contracts/Restaurant";
import {
  GetFeaturedRecipesAction,
  Recipe,
} from "@/Actions/Recipe/GetFeaturedRecipesAction";

// Dados estáticos removidos - agora buscamos restaurantes e receitas do banco

export default function Home() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(true);
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Set<number>>(
    new Set()
  );

  // Buscar restaurantes e receitas em destaque
  useEffect(() => {
    async function fetchData() {
      // Buscar restaurantes
      try {
        setLoadingRestaurants(true);
        const featuredRestaurants = await GetFeaturedRestaurantsAction.execute(
          4
        );
        setRestaurants(featuredRestaurants);
      } catch (error) {
        console.error("Erro ao buscar restaurantes:", error);
      } finally {
        setLoadingRestaurants(false);
      }

      // Buscar receitas
      try {
        setLoadingRecipes(true);
        const featuredRecipes = await GetFeaturedRecipesAction.execute(4);
        setRecipes(featuredRecipes);
      } catch (error) {
        console.error("Erro ao buscar receitas:", error);
      } finally {
        setLoadingRecipes(false);
      }
    }
    fetchData();
  }, []);

  const toggleFavorite = (id: number) => {
    setFavoriteRecipes((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  return (
    <div className="w-full overflow-x-hidden">
      <HeaderMenu />
      <Banner />

      {/* Conteúdo abaixo do banner */}
      <main className="flex flex-col gap-4 mt-8 mb-8 mx-auto containerBox">
        <section className="py-6">
          <div className="text-black font-bold text-2xl">
            Restaurantes em destaque
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-6">
            {loadingRestaurants
              ? // Loading skeleton
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="shadow-md rounded-lg flex flex-col bg-white p-3 animate-pulse"
                  >
                    <div className="w-full h-28 lg:h-40 bg-gray-200 rounded-md"></div>
                    <div className="flex mt-2 space-x-1">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <div
                          key={j}
                          className="w-4 h-4 bg-gray-200 rounded"
                        ></div>
                      ))}
                    </div>
                    <div className="h-6 bg-gray-200 rounded mt-2"></div>
                    <div className="h-4 bg-gray-200 rounded mt-1"></div>
                    <div className="h-4 bg-gray-200 rounded mt-1 w-3/4"></div>
                    <div className="h-8 bg-gray-200 rounded mt-2"></div>
                  </div>
                ))
              : restaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className="shadow-md rounded-lg flex flex-col bg-white p-3 hover:scale-105 transition-transform"
                  >
                    <Image
                      src={restaurant.img || "/restaurante01.jpg"}
                      alt={restaurant.name}
                      width={400}
                      height={250}
                      className="w-full h-28 lg:h-40 object-cover rounded-md"
                    />
                    <div className="flex text-yellow-400 mt-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < Math.round(restaurant.stars_rating || 0)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <h3 className="text-lg font-semibold mt-2">
                      {restaurant.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mt-1">
                      {restaurant.description ||
                        "Restaurante com opções deliciosas"}
                    </p>
                    <div className="text-xs text-gray-500 mt-1">
                      {restaurant.rating_count || 0} avaliações
                    </div>
                    <Link
                      href={`/restaurante/${restaurant.id}`}
                      className="w-full mt-2 py-1 bg-green-600 text-white font-medium 
               hover:bg-green-700 transition text-center block rounded-md"
                    >
                      Detalhe
                    </Link>
                  </div>
                ))}
          </div>
        </section>
        <section className="py-6">
          <div className="text-black font-bold text-2xl">
            Receitas em destaque
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {loadingRecipes
              ? // Loading skeleton
                Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="shadow-md rounded-lg flex flex-col bg-white p-3 animate-pulse"
                  >
                    <div className="w-full h-28 lg:h-40 bg-gray-200 rounded-md"></div>
                    <div className="h-6 bg-gray-200 rounded mt-2"></div>
                    <div className="h-4 bg-gray-200 rounded mt-1"></div>
                    <div className="h-4 bg-gray-200 rounded mt-1 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded mt-1 w-1/2"></div>
                    <div className="h-8 bg-gray-200 rounded mt-2"></div>
                  </div>
                ))
              : recipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="shadow-md p-3 flex flex-col rounded-lg bg-white relative hover:scale-105 transition-transform"
                  >
                    <div className="relative">
                      <Image
                        src={recipe.img || "/prato01.jpg"}
                        alt={recipe.title}
                        width={400}
                        height={250}
                        className="w-full h-28 lg:h-40 object-cover rounded-md"
                      />
                      <FaHeart
                        onClick={() => toggleFavorite(recipe.id)}
                        className={`absolute top-2 right-2 text-xl cursor-pointer transition-colors ${
                          favoriteRecipes.has(recipe.id)
                            ? "text-red-500"
                            : "text-gray-300"
                        }`}
                      />
                    </div>
                    <h3 className="text-lg font-semibold mt-2">
                      {recipe.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mt-1">
                      {recipe.description || "Receita deliciosa e saborosa"}
                    </p>
                    <div className="text-xs text-gray-500 mt-1">
                      {recipe.favorites_count || 0} curtidas
                    </div>
                    <Link
                      href={`/receita/${recipe.id}`}
                      className="w-full mt-2 py-1 bg-green-600 text-white font-medium 
               hover:bg-green-700 transition text-center block rounded-md"
                    >
                      Detalhe
                    </Link>
                  </div>
                ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
