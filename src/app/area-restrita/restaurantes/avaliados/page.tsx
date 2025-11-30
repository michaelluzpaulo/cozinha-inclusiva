"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import HeaderMenu from "@/components/HeaderMenu";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import {
  GetUserRatedRestaurantsAction,
  RestaurantWithRating,
} from "@/Actions/Restaurant/GetUserRatedRestaurantsAction";

function RatedRestaurantsContent() {
  const { client } = useAuth();
  const [restaurants, setRestaurants] = useState<RestaurantWithRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRatedRestaurants() {
      if (!client) return;

      try {
        setLoading(true);
        const ratedRestaurants = await GetUserRatedRestaurantsAction.execute(
          client.id
        );
        setRestaurants(ratedRestaurants);
      } catch (err) {
        console.error("Erro ao buscar restaurantes avaliados:", err);
        setError("Erro ao carregar restaurantes avaliados");
      } finally {
        setLoading(false);
      }
    }

    fetchRatedRestaurants();
  }, [client]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (!client) return null;

  return (
    <>
      <HeaderMenu />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Dashboard", href: "/area-restrita/dashboard" },
          {
            label: "Restaurantes Avaliados",
            href: "/area-restrita/restaurantes/avaliados",
          },
        ]}
      />

      <main className="flex flex-col gap-6 mt-8 mb-8 mx-auto containerBox">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Restaurantes Avaliados
              </h1>
              <p className="text-gray-600">Restaurantes que você já avaliou</p>
            </div>
            <Link
              href="/area-restrita/dashboard"
              className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-200"
            >
              ← Voltar ao Dashboard
            </Link>
          </div>

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-50 p-4 rounded-lg animate-pulse"
                >
                  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
              >
                Tentar Novamente
              </button>
            </div>
          )}

          {!loading && !error && restaurants.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <FaStar size={48} />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Nenhum restaurante avaliado
              </h3>
              <p className="text-gray-500 mb-6">
                Você ainda não avaliou nenhum restaurante. Que tal começar
                agora?
              </p>
              <Link
                href="/restaurantes"
                className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition duration-200"
              >
                Explorar Restaurantes
              </Link>
            </div>
          )}

          {!loading && !error && restaurants.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="relative">
                    <Image
                      src={restaurant.img || "/restaurante01.jpg"}
                      alt={restaurant.name}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full shadow-md">
                      <div className="flex items-center gap-1">
                        <FaStar className="text-yellow-400 text-sm" />
                        <span className="text-sm font-semibold">
                          {restaurant.userRating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {restaurant.name}
                    </h3>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex text-yellow-400">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FaStar
                            key={i}
                            size={16}
                            className={
                              i < restaurant.userRating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        Sua avaliação em {formatDate(restaurant.ratedAt)}
                      </span>
                    </div>

                    {restaurant.ratingComment && (
                      <div className="bg-gray-50 p-3 rounded-md mb-3">
                        <p className="text-sm text-gray-700 italic">
                          &ldquo;{restaurant.ratingComment}&rdquo;
                        </p>
                      </div>
                    )}

                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {restaurant.description ||
                        "Restaurante com opções deliciosas"}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FaStar className="text-yellow-400" size={14} />
                        <span>
                          {restaurant.stars_rating?.toFixed(1) || "0.0"}
                        </span>
                        <span>({restaurant.rating_count || 0} avaliações)</span>
                      </div>

                      <Link
                        href={`/restaurante/${restaurant.id}`}
                        className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-200 text-sm font-medium"
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && restaurants.length > 0 && (
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Total de {restaurants.length} restaurante
                {restaurants.length !== 1 ? "s" : ""} avaliado
                {restaurants.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default function RatedRestaurantsPage() {
  return (
    <ProtectedRoute>
      <RatedRestaurantsContent />
    </ProtectedRoute>
  );
}
