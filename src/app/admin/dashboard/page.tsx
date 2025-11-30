"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, ChefHat, Star, Heart, Database } from "lucide-react";

interface DashboardStats {
  totalRestaurants: number;
  totalRecipes: number;
  totalStars: number;
  totalFavorites: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRestaurants: 0,
    totalRecipes: 0,
    totalStars: 0,
    totalFavorites: 0,
  });
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/dashboard/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Erro ao carregar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const handleSeedRestaurants = async () => {
    setSeeding(true);
    try {
      const response = await fetch("/api/seed/restaurants", {
        method: "POST",
      });
      const result = await response.json();

      if (result.success) {
        alert("✅ Seed de restaurantes executado com sucesso!");
        // Recarregar estatísticas
        const statsResponse = await fetch("/api/dashboard/stats");
        if (statsResponse.ok) {
          const newStats = await statsResponse.json();
          setStats(newStats);
        }
      } else {
        alert(`❌ Erro no seed: ${result.error}`);
      }
    } catch (error) {
      console.error("Erro ao executar seed:", error);
      alert("❌ Erro ao executar seed");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total de Restaurantes</h3>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats.totalRestaurants.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total de Receitas</h3>
            <ChefHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats.totalRecipes.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total de Estrelas</h3>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats.totalStars.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total de Favoritos</h3>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats.totalFavorites.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Resumo Geral</h2>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Restaurantes ativos:
              </span>
              <span className="font-medium">{stats.totalRestaurants}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Receitas cadastradas:
              </span>
              <span className="font-medium">{stats.totalRecipes}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Avaliação média:
              </span>
              <span className="font-medium">
                {stats.totalRestaurants > 0
                  ? (stats.totalStars / stats.totalRestaurants).toFixed(1)
                  : "0"}{" "}
                ⭐
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Engajamento</h2>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Total de favoritos:
              </span>
              <span className="font-medium">{stats.totalFavorites}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">
                Favoritos por restaurante:
              </span>
              <span className="font-medium">
                {stats.totalRestaurants > 0
                  ? (stats.totalFavorites / stats.totalRestaurants).toFixed(1)
                  : "0"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Database className="h-5 w-5" />
              Dados de Teste
            </h2>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Execute o seed para adicionar 10 restaurantes fictícios com
              diferentes restrições alimentares.
            </p>
            <Button
              onClick={handleSeedRestaurants}
              disabled={seeding}
              variant="outline"
              className="w-full"
            >
              {seeding ? "Executando..." : "🌱 Seed Restaurantes"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
