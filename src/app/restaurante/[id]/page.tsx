import Image from "next/image";
import { FaStar } from "react-icons/fa";
import HeaderMenu from "@/components/HeaderMenu";
import Footer from "@/components/Footer";
import { FaWhatsapp, FaPhone, FaGlobe } from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import { notFound } from "next/navigation";
import { FindRestaurantAction } from "@/Actions/Restaurant/FindRestaurantAction";
import { GetRestaurantLocationByRestaurantIdAction } from "@/Actions/RestaurantLocation/GetRestaurantLocationByRestaurantIdAction";
import { GetRestaurantRatingsAction } from "@/Actions/RestaurantRating/GetRestaurantRatingsAction";
import {
  GetRestaurantStatsAction,
  RestaurantStats,
} from "@/Actions/Restaurant/GetRestaurantStatsAction";
import { Restaurant } from "@/Contracts/Restaurant";
import { RestaurantLocation } from "@/Contracts/RestaurantLocation";
import { RestaurantRating } from "@/Contracts/RestaurantRating";
import RecommendationButton from "@/components/RecommendationButton";
import RestaurantReviews from "@/components/RestaurantReviews";

interface PageProps {
  params: Promise<{ id: string }>;
}

interface RestaurantWithLocation extends Restaurant {
  location?: RestaurantLocation | null;
  reviews?: RestaurantRating[];
  stats?: RestaurantStats;
}

async function getRestaurantWithLocation(
  id: string
): Promise<RestaurantWithLocation | null> {
  try {
    // Buscar dados do restaurante
    const restaurant = await FindRestaurantAction.execute(Number(id));

    if (!restaurant || !restaurant.active) {
      return null;
    }

    // Buscar localização do restaurante
    const location = await GetRestaurantLocationByRestaurantIdAction.execute(
      restaurant.id!
    );

    // Buscar recomendações do restaurante
    const reviews = await GetRestaurantRatingsAction.execute(restaurant.id!);

    // Buscar estatísticas do restaurante
    const stats = await GetRestaurantStatsAction.execute(restaurant.id!);

    return {
      ...restaurant,
      location,
      reviews,
      stats,
    };
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return null;
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const restaurante = await getRestaurantWithLocation(id);

  if (!restaurante) {
    notFound();
  }

  // Fallback para imagem caso não tenha
  const restaurantImage = restaurante.img || "/restaurante01.jpg";

  // Calcular rating baseado nas recomendações recebidas
  const rating =
    restaurante.reviews && restaurante.reviews.length > 0
      ? restaurante.reviews.reduce(
          (sum, review) => sum + (review.stars || 0),
          0
        ) / restaurante.reviews.length
      : restaurante.stars_rating || 0;

  // Montar endereço completo usando dados da localização
  const endereco = restaurante.location
    ? [
        restaurante.location.street,
        restaurante.location.number,
        restaurante.location.neighborhood,
        restaurante.location.city,
        restaurante.location.uf,
      ]
        .filter(Boolean)
        .join(", ")
    : null;

  return (
    <>
      <HeaderMenu />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Restaurantes", href: "/restaurantes" },
          { label: restaurante.name, href: `/restaurante/${restaurante.id}` },
        ]}
      />
      <main className="flex flex-col gap-4 mt-8 mb-8 mx-auto">
        <section className="containerBox">
          <h1 className="text-3xl font-bold mb-6">{restaurante.name}</h1>

          {/* Imagem e Descrição Principais */}
          <div className="mb-8">
            <Image
              src={restaurantImage}
              width={800}
              height={400}
              alt={restaurante.name}
              className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-xl shadow-lg mb-6"
            />
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-3 text-gray-800">
                Sobre o Restaurante
              </h2>
              <p className="text-gray-700 leading-relaxed text-justify">
                {restaurante.description || "Descrição não disponível."}
              </p>
            </div>
          </div>

          {/* Layout em grid: Informações + Distribuição das Avaliações */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Coluna 1 e 2: Informações Principais */}
            <div className="lg:col-span-2 space-y-6">
              {/* Avaliações */}
              <div className="flex items-center gap-4 p-4 bg-white border rounded-lg shadow-sm">
                <div className="flex text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar
                      key={i}
                      size={20}
                      className={
                        i < Math.round(restaurante.stats?.averageStars || 0)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }
                    />
                  ))}
                  <span className="ml-2 text-gray-700 text-xl font-semibold">
                    {restaurante.stats?.averageStars?.toFixed(1) || "0.0"}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">/5</span>
                </div>
                <div className="text-gray-600">
                  <span className="font-medium">
                    {restaurante.stats?.totalRatings || 0}
                  </span>
                  <span className="text-sm ml-1">
                    avaliação
                    {(restaurante.stats?.totalRatings || 0) !== 1 ? "ões" : ""}
                  </span>
                </div>
              </div>

              {/* Endereço */}
              {endereco && (
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <h3 className="font-semibold text-lg mb-2 text-green-800 flex items-center gap-2">
                    📍 Localização
                  </h3>
                  <p className="text-gray-700 font-medium">{endereco}</p>
                  {restaurante.location?.cep && (
                    <p className="text-gray-600 text-sm mt-1">
                      CEP: {restaurante.location.cep}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Coluna 3: Distribuição das Avaliações */}
            {restaurante.stats && restaurante.stats.totalRatings > 0 && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border shadow-sm">
                <h3 className="font-semibold mb-4 text-gray-800 flex items-center gap-2">
                  📊 Distribuição das Avaliações
                </h3>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const stats = restaurante.stats;
                    if (!stats) return null;

                    const count =
                      stats.ratingsBreakdown[
                        stars as keyof typeof stats.ratingsBreakdown
                      ];
                    const percentage =
                      stats.totalRatings > 0
                        ? (count / stats.totalRatings) * 100
                        : 0;

                    return (
                      <div key={stars} className="flex items-center gap-3">
                        <span className="w-10 text-sm font-medium text-gray-700 flex items-center gap-1">
                          {stars}
                          <span className="text-yellow-500">★</span>
                        </span>
                        <div className="flex-1 bg-white rounded-full h-3 shadow-inner">
                          <div
                            className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${Math.max(percentage, 2)}%` }}
                          ></div>
                        </div>
                        <span className="w-8 text-sm text-gray-700 font-semibold">
                          {count}
                        </span>
                        <span className="w-12 text-xs text-gray-500">
                          ({percentage.toFixed(0)}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-center text-sm text-gray-600">
                    <span className="font-medium">
                      {restaurante.stats.totalRatings}
                    </span>{" "}
                    avaliações no total
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
        {(restaurante.site || restaurante.phone || restaurante.whatsapp) && (
          <section className="containerBox bg-green-600">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-4">
              {restaurante.site && (
                <a
                  href={
                    restaurante.site.startsWith("http")
                      ? restaurante.site
                      : `https://${restaurante.site}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-4 rounded-md shadow-lg flex gap-2 items-center justify-center hover:scale-105 transition-transform"
                >
                  <FaGlobe title="Site" className="text-2xl text-green-600" />
                  <p className="text-black font-bold">Site</p>
                </a>
              )}

              {restaurante.phone && (
                <a
                  href={`tel:${restaurante.phone}`}
                  className="bg-white p-4 rounded-md shadow-lg flex gap-2 items-center justify-center hover:scale-105 transition-transform"
                >
                  <FaPhone
                    title="Telefone"
                    className="text-2xl text-green-600"
                  />
                  <p className="text-black font-bold">{restaurante.phone}</p>
                </a>
              )}

              {restaurante.whatsapp && (
                <a
                  href={`https://wa.me/${restaurante.whatsapp.replace(
                    /[^\d]/g,
                    ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-4 rounded-md shadow-lg flex gap-2 items-center justify-center hover:scale-105 transition-transform"
                >
                  <FaWhatsapp
                    title="WhatsApp"
                    className="text-2xl text-green-600"
                  />
                  <p className="text-black font-bold">WhatsApp</p>
                </a>
              )}

              <RecommendationButton restaurantId={restaurante.id!} />
            </div>
          </section>
        )}

        <RestaurantReviews reviews={restaurante.reviews || []} />

        {restaurante.location?.map_lat && restaurante.location?.map_lng && (
          <section>
            <div className="w-full h-[450px]">
              <iframe
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2729.6664959895434!2d${restaurante.location.map_lng}!3d${restaurante.location.map_lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0:0x0!2zMzHCsDQ5JzEzLjAiUyA2OMKwMjAnMjQuMCJX!5e1!3m2!1spt-BR!2sbr!4v1755385342837!5m2!1spt-BR!2sbr`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Localização de ${restaurante.name}`}
              ></iframe>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
