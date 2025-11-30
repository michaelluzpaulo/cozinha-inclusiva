"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import {
  GetUserRatedRestaurantsAction,
  RestaurantWithRating,
} from "@/Actions/Restaurant/GetUserRatedRestaurantsAction";

export default function RatedRestaurantsCard() {
  const { client } = useAuth();
  const [restaurants, setRestaurants] = useState<RestaurantWithRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRatedRestaurants() {
      if (!client || !client.id) return;

      console.log("🔍 RatedRestaurantsCard - Cliente logado:", client);

      try {
        setLoading(true);
        const ratedRestaurants = await GetUserRatedRestaurantsAction.execute(
          client.id
        );
        console.log("📊 Restaurantes avaliados recebidos:", ratedRestaurants);
        setRestaurants(ratedRestaurants);
      } catch (err) {
        console.error("Erro ao buscar restaurantes avaliados:", err);
        setError("Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    }

    fetchRatedRestaurants();
  }, [client]);

  if (!client) return null;

  return (
    <div className="bg-gray-50 p-4 rounded-lg border">
      <h3 className="font-medium text-gray-900 mb-2">Restaurantes Avaliados</h3>

      {loading && <p className="text-sm text-gray-600">Carregando...</p>}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <p className="text-sm text-gray-600">
          {restaurants.length > 0
            ? `Você avaliou ${restaurants.length} restaurante${
                restaurants.length !== 1 ? "s" : ""
              }`
            : "Nenhum restaurante avaliado ainda"}
        </p>
      )}

      {!loading && restaurants.length > 0 && (
        <div className="mt-3 mb-2">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <FaStar className="text-yellow-400" size={12} />
            <span>
              Média:{" "}
              {(
                restaurants.reduce((acc, r) => acc + r.userRating, 0) /
                restaurants.length
              ).toFixed(1)}
            </span>
          </div>
        </div>
      )}

      <Link
        href="/area-restrita/restaurantes/avaliados"
        className="mt-2 text-green-600 hover:text-green-700 text-sm font-medium inline-block"
      >
        {restaurants.length > 0 ? "Ver Todos" : "Avaliar Restaurantes"} →
      </Link>
    </div>
  );
}
