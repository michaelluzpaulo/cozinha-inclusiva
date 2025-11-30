"use client";

import { FaCommentDots } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface RecommendationButtonProps {
  restaurantId: number;
}

export default function RecommendationButton({
  restaurantId,
}: RecommendationButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/restaurante/${restaurantId}/recomendacao`);
  };

  return (
    <button
      onClick={handleClick}
      className="bg-white p-4 rounded-md shadow-lg flex gap-2 items-center justify-center hover:scale-105 transition-transform cursor-pointer"
    >
      <FaCommentDots
        title="Deixar Recomendação"
        className="text-2xl text-green-600"
      />
      <p className="text-black font-bold">Deixar Recomendação</p>
    </button>
  );
}
