"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function HeaderMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  return (
    <header
      className={`${
        isHome ? "fixed top-0 left-0 w-full" : "relative"
      } bg-black/80 text-white z-50`}
    >
      <div className="containerBox  mx-auto flex items-center justify-between h-20">
        <Link href="/">
          <Image src="/logo.png" alt="Logo" width={180} height={38} priority />
        </Link>

        {/* Menu Desktop */}
        <nav className="hidden md:flex gap-6 font-bold text-md">
          <Link
            href="/"
            className={`relative after:block after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-white after:transition-all hover:after:w-full ${
              pathname === "/" ? "after:w-full" : "after:w-0"
            }`}
          >
            Home
          </Link>
          <Link
            href="/restaurantes"
            className={`relative after:block after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-white after:transition-all hover:after:w-full ${
              pathname === "/restaurantes" ? "after:w-full" : "after:w-0"
            }`}
          >
            Restaurantes
          </Link>
          <div className="relative group">
            <Link
              href="/receitas"
              className={`relative after:block after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-white after:transition-all hover:after:w-full ${
                pathname === "/receitas" ||
                pathname === "/area-restrita/receitas/favoritas"
                  ? "after:w-full"
                  : "after:w-0"
              }`}
            >
              Receitas
            </Link>
            {/* Dropdown para receitas favoritas */}
            <div className="absolute top-full left-0 mt-2 bg-white text-black rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-48 z-50">
              <Link
                href="/receitas"
                className="block px-4 py-2 hover:bg-gray-100 transition-colors"
              >
                📋 Todas as Receitas
              </Link>
              <Link
                href="/area-restrita/receitas/favoritas"
                className="block px-4 py-2 hover:bg-gray-100 transition-colors"
              >
                ❤️ Minhas Favoritas
              </Link>
            </div>
          </div>
          <Link
            href="/contato"
            className={`relative after:block after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-white after:transition-all hover:after:w-full ${
              pathname === "/contato" ? "after:w-full" : "after:w-0"
            }`}
          >
            Contato
          </Link>
        </nav>

        {/* Área Restrita */}
        <Link
          href="/area-restrita/dashboard"
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
        <div className="md:hidden bg-black/30 px-4 py-3 pb-4 flex flex-col gap-4">
          <Link href="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link href="/restaurantes" onClick={() => setMenuOpen(false)}>
            Restaurantes
          </Link>
          <Link href="/receitas" onClick={() => setMenuOpen(false)}>
            Receitas
          </Link>
          <Link href="/contato" onClick={() => setMenuOpen(false)}>
            Contato
          </Link>
          <Link
            href="/area-restrita/dashboard"
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
