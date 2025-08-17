import Image from "next/image";
import Link from "next/link";
import { SiFacebook, SiInstagram } from "react-icons/si";

export default function Footer() {

  return (
    <footer >
      <div className="flex flex-wrap gap-4 bg-gray-600  containerBox">
        <div className="flex-1 min-w-[200px]  text-white text-center py-4">
          <Link href="/">
            <Image src="/logoFooter.png" alt="Logo" width={146} height={94} priority />
          </Link>
        </div>
        <div className="flex-1 min-w-[200px]  text-white  py-4">
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
          <form action="#" method="POST" className="flex flex-col gap-2 mt-2 w-full max-w-sm">
            <input
              type="email"
              name="email"
              placeholder="voce@exemplo.com"
              required
              className="flex-1 border px-3 py-1 bg-white text-gray-800 
               focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              className="w-40 py-1 border bg-green-600 text-white 
               hover:bg-green-700 transition-colors"
            >
              Enviar
            </button>
          </form>

        </div>
      </div>
      <div className="text-center py-2 bg-green-500 text-white">
        Todos os direitos  2025
      </div>
    </footer>
  );
}