import { FaStar } from "react-icons/fa";
import { RestaurantRating } from "@/Contracts/RestaurantRating";

interface RestaurantReviewsProps {
  reviews: RestaurantRating[];
}

export default function RestaurantReviews({ reviews }: RestaurantReviewsProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <section className="containerBox">
        <h2 className="text-2xl font-bold mb-4">Avaliações</h2>
        <p className="text-gray-600">
          Ainda não há avaliações para este restaurante.
        </p>
      </section>
    );
  }

  const averageRating =
    reviews.reduce((sum, review) => sum + (review.stars || 0), 0) /
    reviews.length;

  return (
    <section className="containerBox">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Avaliações</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <div className="flex text-yellow-400 mr-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar
                  key={i}
                  className={
                    i < Math.round(averageRating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <span className="text-gray-600">
              {averageRating.toFixed(1)} ({reviews.length} avaliação
              {reviews.length !== 1 ? "ões" : ""})
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border-b border-gray-200 pb-4 last:border-b-0"
          >
            <div className="flex items-center mb-2">
              <div className="flex text-yellow-400 mr-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar
                    key={i}
                    className={
                      i < (review.stars || 0)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }
                    size={16}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {new Date(review.createdAt!).toLocaleDateString("pt-BR")}
              </span>
            </div>
            {review.comment && (
              <p className="text-gray-700 mt-2">{review.comment}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
