"use client";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import HeaderMenu from "@/components/HeaderMenu";
import Footer from "@/components/Footer";
import { FaWhatsapp, FaPhone, FaGlobe } from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";

const restaurante = {
  id: 1,
  img: "/restaurante01.jpg",
  title: "Restaurante A",
  text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  rating: 5,
};

export default function Page() {
  return (
    <>
      <HeaderMenu />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Restaurante", href: "/restaurante" },
        ]}
      />
      <main className="flex flex-col gap-4 mt-8 mb-8 mx-auto">
        <section className="containerBox">
          <h1 className="text-3xl font-bold mb-2">{restaurante.title}</h1>
          <div className="flex text-yellow-400 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar
                key={i}
                className={
                  i < restaurante.rating ? "text-yellow-400" : "text-gray-300"
                }
              />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div>
              <Image
                src={restaurante.img}
                width={600}
                height={400}
                alt={restaurante.title}
                className="rounded-md mb-4"
              />
            </div>
            <div>
              <p>{restaurante.text}</p>
            </div>
          </div>
        </section>
        <section className="containerBox bg-green-600">
          <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 py-4">
            <a
              href="https://site.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-4 rounded-md shadow flex gap-2 items-center justify-center shadow-lg  hover:scale-105 transition-transform"
            >
              <FaGlobe title="Site" className="text-2xl text-green-600" />
              <p className="text-black font-bold">site.com.br</p>
            </a>
            <a
              href="tel:+555155555555"
              className="bg-white p-4 rounded-md shadow flex gap-2 items-center justify-center shadow-lg  hover:scale-105 transition-transform"
            >
              <FaPhone title="Telefone" className="text-2xl text-green-600" />
              <p className="text-black font-bold">(51) 5555-5555</p>
            </a>
            <a
              href="https://wa.me/555155555555"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-4 rounded-md shadow flex gap-2 items-center justify-center shadow-lg  hover:scale-105 transition-transform"
            >
              <FaWhatsapp
                title="WhatsApp"
                className="text-2xl text-green-600"
              />
              <p className="text-black font-bold">WhatsApp</p>
            </a>
          </div>
        </section>
        <section>
          <div className="w-full h-[450px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2729.6664959895434!2d-51.199641725402145!3d-30.04603193134827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9519783ee812740b%3A0x2a13c554b52c5bde!2sR.%20Vicente%20da%20Fontoura%2C%201819%20-%20Rio%20Branco%2C%20Porto%20Alegre%20-%20RS%2C%2090630-088!5e1!3m2!1spt-BR!2sbr!4v1755385342837!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização"
            ></iframe>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
