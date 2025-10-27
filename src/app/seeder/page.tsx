"use client";

import { useState } from "react";
import {
  seedClientsActionSupabase,
  clearClientsActionSupabase,
} from "@/Actions/seeder-actions-supabase";

export default function SeederPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  const handleSeedClients = async () => {
    setLoading(true);
    setResult("");

    try {
      const response = await seedClientsActionSupabase();

      if (response.success) {
        setResult(
          `✅ Seeder executado com sucesso! ${response.count} clients criados.`
        );
      } else {
        setResult(`❌ Erro no seeder: ${response.error}`);
      }
    } catch (error) {
      setResult(
        `❌ Erro inesperado: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClearClients = async () => {
    if (!confirm("Tem certeza que deseja limpar todos os clients?")) {
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const response = await clearClientsActionSupabase();

      if (response.success) {
        setResult(
          `✅ Clients removidos com sucesso! ${response.count} registros deletados.`
        );
      } else {
        setResult(`❌ Erro ao limpar: ${response.error}`);
      }
    } catch (error) {
      setResult(
        `❌ Erro inesperado: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            🌱 Database Seeder
          </h1>

          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                Criar Clients de Teste
              </h2>
              <p className="text-gray-600 mb-4">
                Isso criará 5 usuários de exemplo com senhas criptografadas:
              </p>
              <ul className="text-sm text-gray-600 mb-4 space-y-1">
                <li>
                  • <strong>admin@cozinhainclusiva.com</strong> - admin123
                </li>
                <li>• joao.silva@email.com - senha123</li>
                <li>• maria.santos@email.com - maria456</li>
                <li>• pedro.oliveira@email.com - pedro789 (inativo)</li>
                <li>• ana.costa@email.com - ana2024</li>
              </ul>

              <button
                onClick={handleSeedClients}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Executando..." : "Executar Seeder"}
              </button>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Limpar Dados</h2>
              <p className="text-gray-600 mb-4">
                ⚠️ <strong>Cuidado:</strong> Isso removerá TODOS os clients do
                banco de dados!
              </p>

              <button
                onClick={handleClearClients}
                disabled={loading}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Removendo..." : "Limpar Clients"}
              </button>
            </div>

            {result && (
              <div
                className={`p-4 rounded-lg ${
                  result.includes("✅")
                    ? "bg-green-100 border border-green-300 text-green-700"
                    : "bg-red-100 border border-red-300 text-red-700"
                }`}
              >
                <pre className="whitespace-pre-wrap font-mono text-sm">
                  {result}
                </pre>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <a
                href="/area-restrita/signin"
                className="text-blue-600 hover:text-blue-700 underline"
              >
                Ir para página de login →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
