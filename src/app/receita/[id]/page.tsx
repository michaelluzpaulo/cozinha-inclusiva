"use client";
import HeaderMenu from "@/components/HeaderMenu";
import Image from "next/image";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";

const receita = {
  id: 1,
  img: "/restaurante01.jpg",
  title: "Restaurante A",
  text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  type: "Vegano",
};

export default function Page() {
  return (
    <>
      <HeaderMenu />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Receita", href: "/receita" },
        ]}
      />
      <main className="flex flex-col gap-4 mt-8 mb-8 mx-auto">
        <section className="containerBox">
          <h1 className="text-3xl font-bold mb-2">{receita.title}</h1>
          <div className="text-black font-bold text-[12px] mt-1 mb-2">
            {receita.type}
          </div>
          <div>
            {/* Imagem flutuando só no desktop */}
            <div className="md:float-left md:w-[500px] md:mr-6 md:mb-2">
              <Image
                src={receita.img}
                alt={receita.title}
                width={500}
                height={300}
                className="w-full h-auto object-cover rounded-md"
              />
            </div>

            {/* Texto ÚNICO que flui ao lado e depois abaixo em largura total */}
            <p className="text-gray-700 leading-relaxed text-justify">
              {receita.text}
            </p>

            {/* Evita que o conteúdo seguinte “suba” ao lado da imagem flutuada */}
            <div className="clear-both"></div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
