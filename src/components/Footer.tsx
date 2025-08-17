import Image from "next/image";
import Link from "next/link";
import { SiFacebook, SiInstagram } from "react-icons/si";
import Newsletter from "./News";

export default function Footer() {

  return (
    <footer >
      <div className="flex flex-wrap  lg:gap-4 bg-gray-600  containerBox">
        <div className="flex-1 min-w-[200px]  text-white text-center py-4">
          <Link href="/">
            <Image src="/logoFooter.png" alt="Logo" width={146} height={94} priority />
          </Link>
        </div>
        <div className="flex-1 min-w-[200px]  text-white  py-4 hidden lg:block">
          <div className="font-bold text-xl">Links</div>
          <nav className="flex flex-col gap-2 mt-2">
            <Link href="/" className="hover:text-green-300">Home</Link>
            <Link href="/restaurantes" className="hover:text-green-300">Restaurantes</Link>
            <Link href="/receitas" className="hover:text-green-300">Receitas</Link>
            <Link href="/contato" className="hover:text-green-300">Contato</Link>
          </nav>
        </div>
        <div className="flex-1 min-w-[200px] text-white  py-4">
          <div className="font-bold text-xl">Redes Sociais </div>
          <div className="flex items-center gap-3 mt-2">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <SiFacebook size={24} className="hover:text-green-300" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <SiInstagram size={24} className="hover:text-green-300" />
            </a>
          </div>
        </div>
        <div className="flex-1 min-w-[200px]  text-white  py-4">
          <div className="font-bold text-xl">Newsletter</div>
          <div className="mt-2">Assine o nosso newsletter para receber as notícias mais recentes</div>
          <Newsletter />

        </div>
      </div>
      <div className="text-center py-2 bg-green-500 text-white">
        Todos os direitos  2025
      </div>
    </footer>
  );
}