import { config } from "dotenv";
config(); // Carregar variáveis de ambiente

import { db } from "@/db";
import { restaurantRatings } from "@/db/schema";

export async function seedRestaurantRatings() {
  console.log("🌱 Iniciando seeder de restaurant ratings...");

  try {
    // Limpar ratings existentes
    await db.delete(restaurantRatings);
    console.log("🗑️ Ratings existentes removidos");

    // Dados de ratings para seeder
    // IDs dos restaurantes existentes: 8, 9, 10, 11, 12, 13, 14, 15, 16
    // IDs dos clientes existentes: 2, 3, 4, 5, 6
    const ratingsData = [
      // Cliente ID 3 (João Silva) avaliações
      {
        restaurantId: 15, // Cantina do Celíaco
        clientId: 3,
        stars: 5,
        comment:
          "Excelente opção para celíacos! A comida estava deliciosa e o atendimento foi perfeito.",
      },
      {
        restaurantId: 13, // Natureza Integral
        clientId: 3,
        stars: 4,
        comment: "Muito bom, recomendo. Ambiente agradável e pratos saborosos.",
      },
      {
        restaurantId: 12, // Livre de Lactose
        clientId: 3,
        stars: 3,
        comment:
          "Razoável, mas pode melhorar o tempo de espera. Boa opção para intolerantes.",
      },

      // Cliente ID 4 (Maria Santos) avaliações
      {
        restaurantId: 15, // Cantina do Celíaco
        clientId: 4,
        stars: 4,
        comment: "Boa experiência gastronômica. Voltarei em breve!",
      },
      {
        restaurantId: 11, // Halal Palace
        clientId: 4,
        stars: 5,
        comment: "Simplesmente perfeito! Melhor comida halal da cidade.",
      },

      // Mais avaliações para o cliente 3 (João Silva)
      {
        restaurantId: 10, // Kosher Grill
        clientId: 3,
        stars: 4,
        comment: "Muito saboroso! Staff atencioso e ambiente familiar.",
      },
      {
        restaurantId: 16, // Plant Based Kitchen
        clientId: 3,
        stars: 5,
        comment: "Incrível! Comida vegana de altíssima qualidade.",
      },

      // Cliente ID 5 (Pedro Oliveira) avaliações
      {
        restaurantId: 8, // Sabor Verde
        clientId: 5,
        stars: 4,
        comment: "Ótima experiência vegetariana. Pratos bem elaborados.",
      },
      {
        restaurantId: 14, // Tradição Italiana
        clientId: 5,
        stars: 5,
        comment: "Autêntica culinária italiana! Pasta perfeita.",
      },

      // Cliente ID 6 (Ana Costa) avaliações
      {
        restaurantId: 9, // Casa Sem Glúten
        clientId: 6,
        stars: 4,
        comment:
          "Excelente para quem tem restrições alimentares. Variedade boa!",
      },
    ];

    // Inserir ratings
    for (const rating of ratingsData) {
      await db.insert(restaurantRatings).values({
        restaurantId: rating.restaurantId,
        clientId: rating.clientId,
        stars: rating.stars,
        comment: rating.comment,
      });
    }

    console.log(
      `✅ ${ratingsData.length} restaurant ratings inseridos com sucesso!`
    );

    // Verificar quantos ratings foram inseridos
    const totalRatings = await db.select().from(restaurantRatings);
    console.log(`📊 Total de ratings no banco: ${totalRatings.length}`);

    return true;
  } catch (error) {
    console.error("❌ Erro ao criar seeder de restaurant ratings:", error);
    return false;
  }
}

// Executar o seeder se for chamado diretamente
if (require.main === module) {
  seedRestaurantRatings()
    .then(() => {
      console.log("🎉 Seeder finalizado!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Erro no seeder:", error);
      process.exit(1);
    });
}
