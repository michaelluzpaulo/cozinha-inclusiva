"use client";
import HeaderMenu from "@/components/HeaderMenu";
import Image from "next/image";
import Footer from "@/components/Footer";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";

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
  {
    id: 5,
    img: "/restaurante01.jpg",
    title: "Restaurante E",
    text: "Pratos típicos com toque moderno e ambiente familiar.",
    rating: 5,
  },
  {
    id: 6,
    img: "/restaurante02.jpg",
    title: "Restaurante F",
    text: "Cardápio diversificado com opções vegetarianas e veganas.",
    rating: 4,
  },
  {
    id: 7,
    img: "/restaurante03.jpg",
    title: "Restaurante G",
    text: "Culinária internacional em um ambiente sofisticado.",
    rating: 3,
  },
  {
    id: 8,
    img: "/restaurante04.jpg",
    title: "Restaurante H",
    text: "Sabores autênticos e serviço acolhedor para toda a família.",
    rating: 2,
  },
  {
    id: 9,
    img: "/restaurante02.jpg",
    title: "Restaurante I",
    text: "Experiência gastronômica premium com ingredientes frescos.",
    rating: 5,
  },
  {
    id: 10,
    img: "/restaurante01.jpg",
    title: "Restaurante J",
    text: "Ambiente moderno com pratos criativos e sabor único.",
    rating: 4,
  },
];

export default function Page() {
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 mt-6">
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
                      className={
                        i < card.rating ? "text-yellow-400" : "text-gray-300"
                      }
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
      </main>
      <Footer />
    </>
  );
}
