"use client";
import { useState, useEffect } from "react";

export default function Banner() {
  const banners = [
    {
      img: "/banner1.png",
      text: "Encontre restaurantes para restrições alimentares",
    },
    {
      img: "/banner2.jpg",
      text: "Descubra receitas saudáveis para você",
    },
    {
      img: "/banner3.jpg",
      text: "Explore novos restaurantes na sua cidade",
    },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full h-[350px] lg:h-[560px] overflow-hidden relative">
      {/* Container deslizante */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div
            key={index}
            className="w-full h-full flex-shrink-0 bg-center bg-cover flex items-center justify-center"
            style={{ backgroundImage: `url(${banner.img})` }}
          >
            <div className="text-2xl text-white lg:text-[64px] font-bold text-center px-6 drop-shadow-xl containerBox">
              {banner.text}
            </div>
          </div>
        ))}
      </div>

      {/* Bolinhas de navegação */}
      <div className="absolute bottom-6 w-full flex justify-center gap-3">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-4 h-4 rounded-full ${
              index === current ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
