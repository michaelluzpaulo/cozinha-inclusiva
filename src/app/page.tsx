'use client'
import { use, useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import HeaderMenu from '@/components/HeaderMenu';
import Banner from '@/components/Banner';
import Footer from '@/components/Footer';
import { FaStar, FaHeart } from "react-icons/fa";

const cardsData = [
  {
    id: 1,
    img: "/restaurante01.jpg",
    title: "Restaurante A",
    text: "Um ótimo lugar para saborear pratos deliciosos e únicos.",
    rating: 5,
  },
  {
    id: 2,
    img: "/restaurante02.jpg",
    title: "Restaurante B",
    text: "Ambiente acolhedor com cardápio variado e sabor incomparável.",
    rating: 4,
  },
  {
    id: 3,
    img: "/restaurante03.jpg",
    title: "Restaurante C",
    text: "Culinária contemporânea com ingredientes frescos selecionados.",
    rating: 3,
  },
  {
    id: 4,
    img: "/restaurante04.jpg",
    title: "Restaurante D",
    text: "Experiência gastronômica inesquecível com ótimo atendimento.",
    rating: 2,
  },
];
const specialCardsData = [
  {
    id: 1,
    img: "/prato01.jpg",
    title: "Prato Especial A",
    text: "Uma receita deliciosa e cheia de sabor para todos os gostos.",
    type: "Vegano",
    favorite: true,
  },
  {
    id: 2,
    img: "/prato02.jpg",
    title: "Prato Especial B",
    text: "Ingredientes frescos e selecionados para uma experiência única.",
    type: "Celiaco",
    favorite: true,
  },
  {
    id: 3,
    img: "/prato03.jpg",
    title: "Prato Especial C",
    text: "Sabor autêntico com toque gourmet e apresentação impecável.",
    type: "Vegano",
    favorite: false,
  },
  {
    id: 4,
    img: "/prato04.jpg",
    title: "Prato Especial D",
    text: "Uma mistura perfeita de ingredientes frescos e saborosos.",
    type: "Celiaco",
    favorite: false,
  },
];

export default function Home() {
  const [cards, setCards] = useState(specialCardsData);


  const toggleFavorite = (id: number) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, favorite: !card.favorite } : card
      )
    );
  };

  return (
    <div className="w-full overflow-x-hidden">
      <HeaderMenu />
      <Banner />

      {/* Conteúdo abaixo do banner */}
      <main className="flex flex-col gap-4 mt-8 mb-8 mx-auto containerBox">
        <section className="py-6">
          <div className='text-black font-bold text-2xl'>Restaurantes em destaque</div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-6">
            {cardsData.map((card) => (
              <div
                key={card.id}
                className="shadow-md rounded-lg flex flex-col bg-white p-3 hover:scale-105 transition-transform"
              >
                <Image
                  src={card.img}
                  alt={card.title}
                  width={400}
                  height={250}
                  className="w-full h-28 lg:h-40 object-cover rounded-md"
                />
                <div className="flex text-yellow-400 mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < card.rating ? "text-yellow-400" : "text-gray-300"}
                    />
                  ))}
                </div>
                <h3 className="text-lg font-semibold mt-2">{card.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mt-1">
                  {card.text}
                </p>
                <Link
                  href={`/restaurante/${card.id}`}
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
          <div className='text-black font-bold text-2xl'>Receitas em destaque</div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
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
                    className={`absolute top-2 right-2 text-xl cursor-pointer transition-colors ${card.favorite ? "text-red-500" : "text-gray-300"
                      }`}
                  />
                </div>
                <h3 className="text-lg font-semibold mt-2">{card.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mt-1">{card.text}</p>
                <p className="text-black font-bold text-[12px] mt-1">{card.type}</p>
                <Link
                  href={`/receita/${card.id}`}
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
