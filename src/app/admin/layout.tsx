/* eslint-disable @next/next/no-img-element */
"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const username = "admin@admin.com";

  const menuItems = [
    { label: "Dashboard", href: "/admin/dashboard" },
    { label: "Usuários", href: "/admin/users" },
    { label: "Restaurantes", href: "/admin/restaurants" },
    { label: "Receitas", href: "/admin/recipes" },
    { label: "Restrições", href: "/admin/restrictions" },
  ];

  function handleLogout() {
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
      <header className="bg-white shadow flex justify-between items-center p-4">
        <div className="flex items-center gap-2">
          <div className=" bg-green-600 p-3 rounded-full">
            <img src="/logo.png" alt="Logo" className="w-40" />
          </div>
          <span className="font-bold text-lg">Admin Panel</span>
        </div>
        <div className="flex items-center gap-4">
          <span>{username}</span>
          <Button size="sm" variant="outline" onClick={handleLogout}>
            Sair
          </Button>
        </div>
      </header>

      {/* MAIN */}
      <div className="flex flex-1">
        {/* MENU LATERAL */}
        <aside className="w-64 bg-green-600 text-white flex flex-col p-4 gap-2">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="hover:bg-green-700 rounded px-3 py-2 transition"
            >
              {item.label}
            </a>
          ))}
        </aside>

        {/* CONTEÚDO */}
        <main className="flex-1 bg-gray-100 p-6">{children}</main>
      </div>
    </div>
  );
}
