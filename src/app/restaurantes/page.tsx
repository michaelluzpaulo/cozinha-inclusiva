"use client";
import HeaderMenu from "@/components/HeaderMenu";
import Image from "next/image";
import Footer from "@/components/Footer";
import Link from "next/link";
import { FaStar, FaSearch, FaFilter } from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import { useEffect, useState } from "react";
import { ListRestaurantsAction } from "@/Actions/Restaurant/ListRestaurantsAction";
import { ListRestrictionsAction } from "@/Actions/Restriction/ListRestrictionsAction";

const DEFAULT_IMG = "/restaurante01.jpg";

export default function Page() {
  const [allRestaurants, setAllRestaurants] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [restrictions, setRestrictions] = useState<any[]>([]);

  // Filtros
  const [searchName, setSearchName] = useState("");
  const [selectedRestrictions, setSelectedRestrictions] = useState<number[]>(
    []
  );
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [restaurantsData, restrictionsData] = await Promise.all([
          ListRestaurantsAction.execute(),
          ListRestrictionsAction.execute(),
        ]);

        const restaurantsWithDefaults = restaurantsData.map((r: any) => ({
          ...r,
          img: r.img || DEFAULT_IMG,
          stars_rating: r.stars_rating || 0,
          restrictions: (r.restrictions || []).map((res: any) => {
            // Suporta tanto objeto { id: X } quanto apenas ID numérico
            const resId = typeof res === "object" ? res.id : res;
            const restriction = restrictionsData.find(
              (rest) => rest.id === resId
            );
            return { id: resId, name: restriction?.name || "" };
          }),
        }));

        setAllRestaurants(restaurantsWithDefaults);
        setRestaurants(restaurantsWithDefaults);
        setRestrictions(restrictionsData);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let filteredRestaurants = allRestaurants;

    // Filtro por nome
    if (searchName.trim()) {
      filteredRestaurants = filteredRestaurants.filter((restaurant) =>
        restaurant.name?.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    // Filtro por restrições
    if (selectedRestrictions.length > 0) {
      filteredRestaurants = filteredRestaurants.filter((restaurant) =>
        selectedRestrictions.some((restrictionId) =>
          restaurant.restrictions?.some((r: any) => r.id === restrictionId)
        )
      );
    }

    // Filtro por rating mínimo
    if (minRating > 0) {
      filteredRestaurants = filteredRestaurants.filter(
        (restaurant) => (restaurant.stars_rating || 0) >= minRating
      );
    }

    setRestaurants(filteredRestaurants);
  }, [allRestaurants, searchName, selectedRestrictions, minRating]);

  const handleRestrictionChange = (restrictionId: number, checked: boolean) => {
    setSelectedRestrictions((prev) =>
      checked
        ? [...prev, restrictionId]
        : prev.filter((id) => id !== restrictionId)
    );
  };

  return (
    <>
      <HeaderMenu />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Restaurantes", href: "/restaurantes" },
        ]}
      />
      <main className="flex flex-col gap-4 mt-8 mb-8 mx-auto containerBox">
        <section className="py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-black font-bold text-3xl">
              Lista de restaurantes
            </h1>
            <div className="text-sm text-gray-600 bg-green-50 px-3 py-1 rounded-full">
              {restaurants.length} restaurante
              {restaurants.length !== 1 ? "s" : ""} encontrado
              {restaurants.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Filtros melhorados */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-6 shadow-sm">
            {/* Barra de busca principal */}
            <div className="relative mb-4">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500" />
              <input
                type="text"
                placeholder="Buscar restaurantes por nome..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Toggle de filtros avançados */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-green-700 hover:text-green-800 font-medium transition-colors"
            >
              <FaFilter className="text-sm" />
              Filtros avançados
              <span className="text-xs bg-green-200 px-2 py-1 rounded-full">
                {selectedRestrictions.length + (minRating > 0 ? 1 : 0)}
              </span>
            </button>

            {/* Filtros avançados */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-green-200 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Filtro por restrições */}
                <div>
                  <label className="block text-sm font-semibold text-green-800 mb-3">
                    🍽️ Restrições alimentares atendidas
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {restrictions.map((restriction) => (
                      <label
                        key={restriction.id}
                        className="flex items-center space-x-2 p-2 bg-white rounded-lg border border-green-200 hover:bg-green-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedRestrictions.includes(
                            restriction.id
                          )}
                          onChange={(e) =>
                            handleRestrictionChange(
                              restriction.id,
                              e.target.checked
                            )
                          }
                          className="rounded text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">
                          {restriction.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Filtro por rating */}
                <div>
                  <label className="block text-sm font-semibold text-green-800 mb-3">
                    ⭐ Avaliação mínima
                  </label>
                  <div className="space-y-2">
                    {[0, 1, 2, 3, 4, 5].map((rating) => (
                      <label
                        key={rating}
                        className="flex items-center space-x-2 p-2 bg-white rounded-lg border border-green-200 hover:bg-green-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="radio"
                          name="rating"
                          value={rating}
                          checked={minRating === rating}
                          onChange={(e) => setMinRating(Number(e.target.value))}
                          className="text-green-600 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700 flex items-center gap-1">
                          {rating === 0 ? (
                            "Todas as avaliações"
                          ) : (
                            <>
                              {Array.from({ length: rating }).map((_, i) => (
                                <FaStar
                                  key={i}
                                  className="text-yellow-400 text-xs"
                                />
                              ))}
                              <span className="ml-1">({rating}+ estrelas)</span>
                            </>
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Botão limpar filtros */}
            {(searchName ||
              selectedRestrictions.length > 0 ||
              minRating > 0) && (
              <div className="mt-4 pt-4 border-t border-green-200">
                <button
                  onClick={() => {
                    setSearchName("");
                    setSelectedRestrictions([]);
                    setMinRating(0);
                  }}
                  className="text-sm text-green-700 hover:text-green-800 underline"
                >
                  Limpar todos os filtros
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center text-gray-500 py-8">Carregando...</div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 mt-6">
              {restaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className="shadow-md rounded-lg flex flex-col bg-white p-3 hover:scale-105 transition-transform"
                >
                  <Image
                    src={restaurant.img || DEFAULT_IMG}
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
                          i < (restaurant.stars_rating || 0)
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
                    {restaurant.description || "Sem descrição."}
                  </p>

                  {/* Exibir restrições */}
                  {restaurant.restrictions &&
                    restaurant.restrictions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {restaurant.restrictions.map((restriction: any) => (
                          <span
                            key={restriction.id}
                            className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                          >
                            {restriction.name}
                          </span>
                        ))}
                      </div>
                    )}
                  <Link
                    href={`/restaurante/${restaurant.id}`}
                    className="w-full mt-2 py-1 bg-green-600 text-white font-medium 
                       hover:bg-green-700 transition text-center block rounded-md"
                  >
                    Detalhe
                  </Link>
                </div>
              ))}
              {restaurants.length === 0 && !loading && (
                <div className="col-span-4 text-center text-gray-500 py-8">
                  Nenhum restaurante encontrado.
                </div>
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
