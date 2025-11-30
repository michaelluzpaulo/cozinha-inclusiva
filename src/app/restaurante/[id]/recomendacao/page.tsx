"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa";
import HeaderMenu from "@/components/HeaderMenu";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

interface PageProps {
  params: Promise<{ id: string }>;
}

function RecommendationContent({ params }: PageProps) {
  const router = useRouter();
  const { client } = useAuth();
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [restaurantId, setRestaurantId] = useState<string>("");

  // Extrair o ID do restaurante dos params
  React.useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setRestaurantId(resolvedParams.id);
    };
    getParams();
  }, [params]);

  const handleStarClick = (star: number) => {
    setRating(star);
  };

  const handleStarHover = (star: number) => {
    setHoverRating(star);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      alert("Por favor, selecione uma avaliação com estrelas.");
      return;
    }

    if (!client) {
      alert("É necessário estar logado para avaliar um restaurante.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/restaurant-rating", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurantId: Number(restaurantId),
          clientId: client.id,
          rating,
          comment: comment.trim() || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao enviar recomendação");
      }

      const result = await response.json();
      console.log("Recomendação salva:", result);

      alert("Recomendação enviada com sucesso!");
      router.push(`/restaurante/${restaurantId}`);
    } catch (error) {
      console.error("Erro ao enviar recomendação:", error);
      alert("Erro ao enviar recomendação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <HeaderMenu />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Restaurantes", href: "/restaurantes" },
          { label: "Restaurante", href: `/restaurante/${restaurantId}` },
          {
            label: "Deixar Recomendação",
            href: `/restaurante/${restaurantId}/recomendacao`,
          },
        ]}
      />

      <main className="flex flex-col gap-4 mt-8 mb-8 mx-auto">
        <section className="containerBox">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">
              Deixar Recomendação
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Sistema de Estrelas */}
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">
                  Como você avalia este restaurante?
                </h2>
                <div className="flex justify-center gap-2 mb-2">
                  {Array.from({ length: 5 }).map((_, index) => {
                    const starNumber = index + 1;
                    const isActive = starNumber <= (hoverRating || rating);

                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleStarClick(starNumber)}
                        onMouseEnter={() => handleStarHover(starNumber)}
                        onMouseLeave={handleStarLeave}
                        className="transition-colors duration-200 hover:scale-110 transform"
                      >
                        <FaStar
                          className={`text-4xl ${
                            isActive ? "text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <p className="text-gray-600">
                  {rating > 0
                    ? `Você selecionou ${rating} estrela${
                        rating > 1 ? "s" : ""
                      }`
                    : "Clique nas estrelas para avaliar"}
                </p>
              </div>

              {/* Campo de Comentário */}
              <div>
                <label
                  htmlFor="comment"
                  className="block text-lg font-semibold mb-2"
                >
                  Comentário (opcional)
                </label>
                <textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Compartilhe sua experiência com este restaurante..."
                  className="w-full p-4 border border-gray-300 rounded-md resize-vertical min-h-[120px] focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  maxLength={500}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {comment.length}/500 caracteres
                </p>
              </div>

              {/* Botões */}
              <div className="flex gap-4 justify-center">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={rating === 0 || isSubmitting}
                  className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Enviando..." : "Enviar Recomendação"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default function RecommendationPage({ params }: PageProps) {
  return (
    <ProtectedRoute>
      <RecommendationContent params={params} />
    </ProtectedRoute>
  );
}
