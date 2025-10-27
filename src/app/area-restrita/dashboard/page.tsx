"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import HeaderMenu from "@/components/HeaderMenu";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";

function DashboardContent() {
  const { client, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/area-restrita/signin");
  };

  if (!client) return null;

  return (
    <>
      <HeaderMenu />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Área Restrita", href: "/area-restrita/signin" },
          { label: "Dashboard", href: "/area-restrita/dashboard" },
        ]}
      />

      <main className="flex flex-col gap-6 mt-8 mb-8 mx-auto containerBox">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-gray-600">Bem-vindo à sua área restrita</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200"
            >
              Sair
            </button>
          </div>

          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h2 className="text-lg font-semibold text-green-800 mb-4">
              Informações da Conta
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nome:
                </label>
                <p className="text-gray-900 font-medium">{client.nome}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email:
                </label>
                <p className="text-gray-900 font-medium">{client.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status:
                </label>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    client.active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {client.active ? "Ativo" : "Inativo"}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ID:
                </label>
                <p className="text-gray-900 font-medium">#{client.id}</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Funcionalidades</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="font-medium text-gray-900 mb-2">
                  Receitas Favoritas
                </h3>
                <p className="text-sm text-gray-600">
                  Gerencie suas receitas favoritas
                </p>
                <button className="mt-2 text-green-600 hover:text-green-700 text-sm font-medium">
                  Ver Receitas →
                </button>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="font-medium text-gray-900 mb-2">
                  Restaurantes Salvos
                </h3>
                <p className="text-sm text-gray-600">
                  Seus restaurantes preferidos
                </p>
                <button className="mt-2 text-green-600 hover:text-green-700 text-sm font-medium">
                  Ver Restaurantes →
                </button>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="font-medium text-gray-900 mb-2">Perfil</h3>
                <p className="text-sm text-gray-600">Edite suas informações</p>
                <button className="mt-2 text-green-600 hover:text-green-700 text-sm font-medium">
                  Editar Perfil →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
