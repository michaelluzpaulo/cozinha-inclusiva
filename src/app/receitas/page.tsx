"use client";
import { useState, useEffect } from "react";
import HeaderMenu from "@/components/HeaderMenu";
import Image from "next/image";
import Footer from "@/components/Footer";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";
import { ListRecipesAction } from "@/Actions/Recipe/ListRecipesAction";

const DEFAULT_IMG = "/prato01.jpg";

export default function Page() {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecipes() {
      setLoading(true);
      try {
        const data = await ListRecipesAction.execute();
        setCards(
          data.map((r: any) => ({
            ...r,
            img: r.img || DEFAULT_IMG,
            favorite: false,
            type:
              Array.isArray(r.restrictions) && r.restrictions.length > 0
                ? "Com restrição"
                : "Livre",
          }))
        );
      } finally {
        setLoading(false);
      }
    }
    fetchRecipes();
  }, []);

  const toggleFavorite = (id: number) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, favorite: !card.favorite } : card
      )
    );
  };

  return (
    <>
      <HeaderMenu />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Receitas", href: "/receitas" },
        ]}
      />
      <main className="flex flex-col gap-4 mt-8 mb-8 mx-auto containerBox">
        <section className="py-6">
          <div className="text-black font-bold text-2xl">Lista de receitas</div>
          {loading ? (
            <div className="text-center text-gray-500 py-8">Carregando...</div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 mt-6">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="shadow-md p-3 flex flex-col rounded-lg bg-white relative hover:scale-105 transition-transform"
                >
                  <div className="relative">
                    <Image
                      src={card.img}
                      alt={card.title}
                      width={400}
                      height={250}
                      className="w-full h-28 lg:h-40 object-cover rounded-md"
                    />
                    <FaHeart
                      onClick={() => toggleFavorite(card.id)}
                      className={`absolute top-2 right-2 text-xl cursor-pointer transition-colors ${
                        card.favorite ? "text-red-500" : "text-gray-300"
                      }`}
                    />
                  </div>
                  <h3 className="text-lg font-semibold mt-2">{card.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mt-1">
                    {card.description || "Sem descrição."}
                  </p>
                  <p className="text-black font-bold text-[12px] mt-1">
                    {card.type}
                  </p>
                  <Link
                    href={`/receita/${card.id}`}
                    className="w-full mt-2 py-1 bg-green-600 text-white font-medium 
                           hover:bg-green-700 transition text-center block rounded-md"
                  >
                    Detalhe
                  </Link>
                </div>
              ))}
              {cards.length === 0 && !loading && (
                <div className="col-span-4 text-center text-gray-500 py-8">
                  Nenhuma receita encontrada.
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
