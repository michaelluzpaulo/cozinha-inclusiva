"use client";
import HeaderMenu from "@/components/HeaderMenu";
import Image from "next/image";
import Footer from "@/components/Footer";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import { useEffect, useState } from "react";
import { ListRestaurantsAction } from "@/Actions/Restaurant/ListRestaurantsAction";

const DEFAULT_IMG = "/restaurante01.jpg";

export default function Page() {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchRestaurants() {
      setLoading(true);
      try {
        const data = await ListRestaurantsAction.execute();
        setRestaurants(data);
      } finally {
        setLoading(false);
      }
    }
    fetchRestaurants();
  }, []);

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
          <div className="text-black font-bold text-2xl">
            Lista de restaurantes
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
