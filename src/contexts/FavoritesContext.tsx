"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getUserFavoritesAction } from "@/Actions/Client/toggleFavoriteRecipeAction";
import { useAuth } from "./AuthContext";

interface FavoritesContextType {
  favorites: number[];
  addFavorite: (recipeId: number) => void;
  removeFavorite: (recipeId: number) => void;
  isFavorite: (recipeId: number) => boolean;
  loadingFavorites: boolean;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { client } = useAuth();
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  // Carregar favoritos do usuário quando ele fizer login
  useEffect(() => {
    const loadFavorites = async () => {
      if (!client?.id) {
        setFavorites([]);
        return;
      }

      setLoadingFavorites(true);
      try {
        const userFavorites = await getUserFavoritesAction(client.id);
        setFavorites(userFavorites);
        console.log("✅ Favoritos carregados:", userFavorites);
      } catch (error) {
        console.error("❌ Erro ao carregar favoritos:", error);
        setFavorites([]);
      } finally {
        setLoadingFavorites(false);
      }
    };

    loadFavorites();
  }, [client?.id]);

  // Função para recarregar favoritos (para uso externo)
  const loadFavorites = async () => {
    if (!client?.id) {
      setFavorites([]);
      return;
    }

    setLoadingFavorites(true);
    try {
      const userFavorites = await getUserFavoritesAction(client.id);
      setFavorites(userFavorites);
      console.log("✅ Favoritos recarregados:", userFavorites);
    } catch (error) {
      console.error("❌ Erro ao carregar favoritos:", error);
      setFavorites([]);
    } finally {
      setLoadingFavorites(false);
    }
  };

  const addFavorite = (recipeId: number) => {
    setFavorites((prev) => {
      if (!prev.includes(recipeId)) {
        const newFavorites = [...prev, recipeId];
        console.log("➕ Favorito adicionado ao estado:", recipeId);
        return newFavorites;
      }
      return prev;
    });
  };

  const removeFavorite = (recipeId: number) => {
    setFavorites((prev) => {
      const newFavorites = prev.filter((id) => id !== recipeId);
      console.log("➖ Favorito removido do estado:", recipeId);
      return newFavorites;
    });
  };

  const isFavorite = (recipeId: number) => {
    return favorites.includes(recipeId);
  };

  const refreshFavorites = loadFavorites;

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        loadingFavorites,
        refreshFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error(
      "useFavorites deve ser usado dentro de um FavoritesProvider"
    );
  }
  return context;
}
