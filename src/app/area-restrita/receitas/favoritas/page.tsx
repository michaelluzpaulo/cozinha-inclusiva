"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import HeaderMenu from "@/components/HeaderMenu";
import Image from "next/image";
import Footer from "@/components/Footer";
import Link from "next/link";
import { FaHeart, FaArrowLeft, FaStar } from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import {
  listFavoriteRecipesAction,
  FavoriteRecipe,
} from "@/Actions/Client/ListFavoriteRecipesAction";
import { toggleFavoriteRecipeAction } from "@/Actions/Client/toggleFavoriteRecipeAction";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";

const DEFAULT_IMG = "/prato01.jpg";

export default function FavoritasPage() {
  const { client } = useAuth();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const router = useRouter();
  const [favoriteRecipes, setFavoriteRecipes] = useState<FavoriteRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoriteLoading, setFavoriteLoading] = useState<number | null>(null);

  // Verificar se usuário está logado
  useEffect(() => {
    if (!client?.id) {
      router.push("/area-restrita/signin");
      return;
    }
  }, [client, router]);

  // Buscar receitas favoritas
  useEffect(() => {
    async function fetchFavoriteRecipes() {
      if (!client?.id) return;

      setLoading(true);
      try {
        const data = await listFavoriteRecipesAction(client.id);
        setFavoriteRecipes(data);
      } catch (error) {
        console.error("Erro ao buscar receitas favoritas:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFavoriteRecipes();
  }, [client?.id]);

  const handleToggleFavorite = async (recipeId: number) => {
    if (!client?.id) return;

    setFavoriteLoading(recipeId);

    try {
      const result = await toggleFavoriteRecipeAction(client.id, recipeId);

      if (result.success) {
        // Atualizar estado global de favoritos
        if (result.isFavorited) {
          addFavorite(recipeId);
        } else {
          removeFavorite(recipeId);
          // Remover da lista local quando desfavoritar
          setFavoriteRecipes((prev) =>
            prev.filter((recipe) => recipe.id !== recipeId)
          );
        }

        console.log(result.message);
      } else {
        console.error("Erro:", result.message);
      }
    } catch (error) {
      console.error("Erro ao processar favorito:", error);
    } finally {
      setFavoriteLoading(null);
    }
  };

  // Se não estiver logado, não renderizar nada (será redirecionado)
  if (!client?.id) {
    return null;
  }

  return (
    <>
      <HeaderMenu />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Área Restrita", href: "/area-restrita/dashboard" },
          { label: "Receitas", href: "/receitas" },
          { label: "Favoritas", href: "/area-restrita/receitas/favoritas" },
        ]}
      />
      <main className="flex flex-col gap-4 mt-8 mb-8 mx-auto containerBox">
        <section className="py-6">
          {/* Cabeçalho */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link
                href="/receitas"
                className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
              >
                <FaArrowLeft />
                <span>Voltar às receitas</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-black font-bold text-3xl flex items-center gap-3">
              <FaHeart className="text-red-500" />
              Minhas Receitas Favoritas
            </h1>
            <div className="text-sm text-gray-600 bg-red-50 px-3 py-1 rounded-full">
              {favoriteRecipes.length} receita
              {favoriteRecipes.length !== 1 ? "s" : ""} favorita
              {favoriteRecipes.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Informações para o usuário */}
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-6 shadow-sm mb-6">
            <div className="flex items-center gap-3 text-red-700">
              <FaStar className="text-red-500" />
              <p className="text-sm">
                Aqui estão todas as suas receitas favoritas, organizadas em
                ordem alfabética. Clique no coração para remover uma receita dos
                favoritos.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="text-center text-gray-500 py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4">Carregando suas receitas favoritas...</p>
            </div>
          ) : favoriteRecipes.length === 0 ? (
            <div className="text-center py-12">
              <FaHeart className="mx-auto text-6xl text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Você ainda não tem receitas favoritas
              </h3>
              <p className="text-gray-500 mb-6">
                Explore nossa coleção de receitas e adicione suas preferidas aos
                favoritos.
              </p>
              <Link
                href="/receitas"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                <FaStar />
                Explorar Receitas
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
              {favoriteRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="shadow-md p-3 flex flex-col rounded-lg bg-white relative hover:scale-105 transition-transform"
                >
                  <div className="relative">
                    <Image
                      src={recipe.img || DEFAULT_IMG}
                      alt={recipe.title}
                      width={400}
                      height={250}
                      className="w-full h-28 lg:h-40 object-cover rounded-md"
                    />
                    <FaHeart
                      onClick={() => handleToggleFavorite(recipe.id)}
                      className={`absolute top-2 right-2 text-xl cursor-pointer transition-colors ${
                        favoriteLoading === recipe.id
                          ? "text-yellow-500 animate-pulse"
                          : "text-red-500"
                      }`}
                      title="Remover dos favoritos"
                    />
                  </div>
                  <h3 className="text-lg font-semibold mt-2">{recipe.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mt-1">
                    {recipe.description || "Sem descrição."}
                  </p>

                  {/* Data de adição aos favoritos */}
                  {recipe.createdAt && (
                    <div className="text-xs text-gray-400 mt-1">
                      Adicionada em{" "}
                      {new Date(recipe.createdAt).toLocaleDateString("pt-BR")}
                    </div>
                  )}

                  <Link
                    href={`/receita/${recipe.id}`}
                    className="w-full mt-2 py-1 bg-green-600 text-white font-medium 
                           hover:bg-green-700 transition text-center block rounded-md"
                  >
                    Ver Receita
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
