import { use, useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function HeaderMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isHome = usePathname() === '/';
  return (
    <header className={`${isHome ? "fixed top-0 left-0 w-full" : "relative"} bg-black/70 text-white z-50`}>
      <div className="containerBox  mx-auto flex items-center justify-between h-20">
        {/* Logo */}
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={180} height={38} priority />
        </Link>

        {/* Menu Desktop */}
        <nav className="hidden md:flex gap-6 font-bold text-md">
          <Link href="/">Home</Link>
          <Link href="/restaurantes">Restaurantes</Link>
          <Link href="/receitas">Receitas</Link>
          <Link href="/contato">Contato</Link>
        </nav>

        {/* Área Restrita */}
        <Link
          href="/pratos"
          className="hidden md:block bg-green-600 px-4 py-2 rounded hover:bg-green-800 transition font-bold text-md"
        >
          Área Restrita
        </Link>

        {/* Menu Mobile */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menu Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-black/90 px-4 pb-4 flex flex-col gap-4">
          <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/restaurantes" onClick={() => setMenuOpen(false)}>Restaurantes</Link>
          <Link href="/receitas" onClick={() => setMenuOpen(false)}>Receitas</Link>
          <Link href="/contato" onClick={() => setMenuOpen(false)}>Contato</Link>
          <Link
            href="/pratos"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-800 transition"
            onClick={() => setMenuOpen(false)}
          >
            Área Restrita
          </Link>
        </div>
      )}
    </header>
  );
}