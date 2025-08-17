'use client'
import { useState } from 'react';
import HeaderMenu from "@/components/HeaderMenu";
import Image from "next/image";
import Footer from '@/components/Footer';
import Link from "next/link";
import { FaHeart } from 'react-icons/fa';

const CardsData = [
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
  {
    id: 5,
    img: "/prato03.jpg",
    title: "Prato Especial E",
    text: "Um prato leve e nutritivo, ideal para qualquer refeição.",
    type: "Vegano",
    favorite: true,
  },
  {
    id: 6,
    img: "/prato01.jpg",
    title: "Prato Especial F",
    text: "Combinação de sabores exóticos com ingredientes selecionados.",
    type: "Celiaco",
    favorite: false,
  },
  {
    id: 7,
    img: "/prato02.jpg",
    title: "Prato Especial G",
    text: "Sabor intenso e aroma irresistível para os amantes da boa comida.",
    type: "Vegano",
    favorite: true,
  },
  {
    id: 8,
    img: "/prato04.jpg",
    title: "Prato Especial H",
    text: "Uma receita clássica reinventada com ingredientes modernos.",
    type: "Celiaco",
    favorite: false,
  },
  {
    id: 9,
    img: "/prato03.jpg",
    title: "Prato Especial I",
    text: "Prato sofisticado com apresentação elegante e sabor marcante.",
    type: "Vegano",
    favorite: false,
  },
  {
    id: 10,
    img: "/prato02.jpg",
    title: "Prato Especial J",
    text: "Uma experiência gastronômica única, perfeita para compartilhar.",
    type: "Celiaco",
    favorite: true,
  },
];


export default function Page() {
  const [cards, setCards] = useState(CardsData);

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
      <main className="flex flex-col gap-4 mt-8 mb-8 mx-auto containerBox">
        <section className="py-6">
          <div className='text-black font-bold text-2xl'>Lista de restaurantes</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-6">
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
                    className="w-full h-40 object-cover rounded-md"
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
    </>
  );
}
