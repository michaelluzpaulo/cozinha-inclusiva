import { createClient } from "@supabase/supabase-js";
import { generateSlug } from "@/lib/utils";

interface RestaurantSeedData {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  site: string;
  description: string;
  cep: string;
  uf: string;
  city: string;
  district: string;
  street: string;
  number: string;
  restrictions: number[];
}

const restaurantsSeedData: RestaurantSeedData[] = [
  {
    name: "Sabor Verde",
    email: "contato@saborverde.com.br",
    phone: "(11) 3456-7890",
    whatsapp: "(11) 99876-5432",
    site: "https://saborverde.com.br",
    description:
      "Restaurante especializado em culinária vegetariana e vegana, com pratos frescos e saudáveis preparados com ingredientes orgânicos.",
    cep: "01310-100",
    uf: "SP",
    city: "São Paulo",
    district: "Bela Vista",
    street: "Avenida Paulista",
    number: "1234",
    restrictions: [1, 2], // Vegetariano, Vegano
  },
  {
    name: "Casa Sem Glúten",
    email: "info@casasemgluten.com.br",
    phone: "(21) 2345-6789",
    whatsapp: "(21) 98765-4321",
    site: "https://casasemgluten.com.br",
    description:
      "Especializado em pratos 100% livres de glúten, oferecendo opções seguras para celíacos e intolerantes.",
    cep: "22071-900",
    uf: "RJ",
    city: "Rio de Janeiro",
    district: "Copacabana",
    street: "Avenida Atlântica",
    number: "567",
    restrictions: [3], // Sem Glúten
  },
  {
    name: "Kosher Grill",
    email: "reservas@koshergrill.com.br",
    phone: "(11) 4567-8901",
    whatsapp: "(11) 97654-3210",
    site: "https://koshergrill.com.br",
    description:
      "Churrascaria kosher com carnes selecionadas e preparadas seguindo rigorosamente as leis dietéticas judaicas.",
    cep: "04038-001",
    uf: "SP",
    city: "São Paulo",
    district: "Vila Olímpia",
    street: "Rua Funchal",
    number: "789",
    restrictions: [4], // Kosher
  },
  {
    name: "Halal Palace",
    email: "contato@halalpalace.com.br",
    phone: "(11) 5678-9012",
    whatsapp: "(11) 96543-2109",
    site: "https://halalpalace.com.br",
    description:
      "Culinária árabe e mediterrânea halal, com pratos tradicionais e especiarias autênticas.",
    cep: "03310-000",
    uf: "SP",
    city: "São Paulo",
    district: "Tatuapé",
    street: "Rua Tuiuti",
    number: "456",
    restrictions: [5], // Halal
  },
  {
    name: "Livre de Lactose",
    email: "pedidos@livrelactose.com.br",
    phone: "(31) 3456-7890",
    whatsapp: "(31) 99876-5432",
    site: "https://livrelactose.com.br",
    description:
      "Restaurante dedicado a pessoas com intolerância à lactose, com cardápio 100% livre de derivados do leite.",
    cep: "30112-000",
    uf: "MG",
    city: "Belo Horizonte",
    district: "Centro",
    street: "Avenida Afonso Pena",
    number: "123",
    restrictions: [6], // Sem Lactose
  },
  {
    name: "Natureza Integral",
    email: "info@naturezaintegral.com.br",
    phone: "(41) 2345-6789",
    whatsapp: "(41) 98765-4321",
    site: "https://naturezaintegral.com.br",
    description:
      "Bistrô com foco em alimentação natural, orgânica e sustentável, servindo pratos vegetarianos e veganos.",
    cep: "80010-000",
    uf: "PR",
    city: "Curitiba",
    district: "Centro",
    street: "Rua XV de Novembro",
    number: "890",
    restrictions: [1, 2], // Vegetariano, Vegano
  },
  {
    name: "Tradição Italiana",
    email: "reservas@tradicaoitaliana.com.br",
    phone: "(51) 3456-7890",
    whatsapp: "(51) 99876-5432",
    site: "https://tradicaoitaliana.com.br",
    description:
      "Autêntica culinária italiana com massas artesanais, pizzas no forno a lenha e vinhos selecionados.",
    cep: "90010-150",
    uf: "RS",
    city: "Porto Alegre",
    district: "Centro Histórico",
    street: "Rua dos Andradas",
    number: "234",
    restrictions: [], // Sem restrições específicas
  },
  {
    name: "Cantina do Celíaco",
    email: "contato@cantinaceliaco.com.br",
    phone: "(85) 2345-6789",
    whatsapp: "(85) 98765-4321",
    site: "https://cantinaceliaco.com.br",
    description:
      "Especializada em culinária italiana sem glúten, com massas, pizzas e pães especiais para celíacos.",
    cep: "60015-100",
    uf: "CE",
    city: "Fortaleza",
    district: "Aldeota",
    street: "Avenida Santos Dumont",
    number: "567",
    restrictions: [3], // Sem Glúten
  },
  {
    name: "Plant Based Kitchen",
    email: "pedidos@plantbased.com.br",
    phone: "(61) 3456-7890",
    whatsapp: "(61) 99876-5432",
    site: "https://plantbasedkitchen.com.br",
    description:
      "Cozinha 100% plant-based com hambúrgueres vegetais, bowls nutritivos e sobremesas veganas.",
    cep: "70040-010",
    uf: "DF",
    city: "Brasília",
    district: "Asa Norte",
    street: "Quadra 704 Norte",
    number: "12",
    restrictions: [1, 2, 6], // Vegetariano, Vegano, Sem Lactose
  },
  {
    name: "Gourmet Sem Restrições",
    email: "info@gourmetsemrestricoes.com.br",
    phone: "(71) 2345-6789",
    whatsapp: "(71) 98765-4321",
    site: "https://gourmetsemrestricoes.com.br",
    description:
      "Restaurante gourmet que oferece opções para todas as restrições alimentares, com cardápio adaptável.",
    cep: "40070-110",
    uf: "BA",
    city: "Salvador",
    district: "Barra",
    street: "Avenida Oceânica",
    number: "789",
    restrictions: [1, 2, 3, 6], // Vegetariano, Vegano, Sem Glúten, Sem Lactose
  },
];

export class SeedRestaurantsAction {
  static async execute(): Promise<void> {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
      console.log("🚀 Iniciando seed de restaurantes...");

      // Verificar se existe pelo menos um usuário
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id")
        .limit(1);

      if (usersError) {
        throw new Error(`Erro ao verificar usuários: ${usersError.message}`);
      }

      if (!users || users.length === 0) {
        throw new Error(
          "Nenhum usuário encontrado. Crie um usuário antes de executar o seed."
        );
      }

      const userId = users[0].id;
      console.log(`📝 Usando user_id: ${userId}`);

      // Inserir restaurantes
      for (const restaurantData of restaurantsSeedData) {
        const {
          restrictions,
          cep,
          uf,
          city,
          district,
          street,
          number,
          ...restaurantFields
        } = restaurantData;

        // Gerar slug a partir do nome
        const slug = generateSlug(restaurantFields.name);

        console.log(`📍 Inserindo restaurante: ${restaurantFields.name}`);

        // Inserir restaurante
        const restaurantToInsert = {
          ...restaurantFields,
          slug,
          user_id: userId,
          active: true,
          show_price: true,
          favorites_count: Math.floor(Math.random() * 100),
          rating_count: Math.floor(Math.random() * 50),
          stars_rating: Math.floor(Math.random() * 5) + 1,
        };

        console.log("📋 Dados do restaurante:", restaurantToInsert);

        const { data: restaurant, error: restaurantError } = await supabase
          .from("restaurants")
          .insert([restaurantToInsert])
          .select("id")
          .single();

        if (restaurantError) {
          console.error(
            `❌ Erro ao inserir restaurante ${restaurantFields.name}:`,
            restaurantError
          );
          throw new Error(
            `Falha ao inserir restaurante: ${restaurantError.message}`
          );
        }

        if (!restaurant || !restaurant.id) {
          throw new Error(
            `Restaurante inserido mas ID não retornado para ${restaurantFields.name}`
          );
        }

        const restaurantId = restaurant.id;
        console.log(`✅ Restaurante inserido com ID: ${restaurantId}`);

        // Inserir localização
        console.log(
          `📍 Inserindo localização para restaurante ID: ${restaurantId}`
        );
        const locationData = {
          restaurant_id: restaurantId,
          cep,
          uf,
          city,
          neighborhood: district,
          street,
          number,
        };

        console.log("🏠 Dados da localização:", locationData);

        const { error: locationError } = await supabase
          .from("restaurant_locations")
          .insert([locationData]);

        if (locationError) {
          console.error(
            `❌ Erro ao inserir localização do restaurante ${restaurantFields.name}:`,
            locationError
          );
          // Não parar aqui, continuar com o próximo
        } else {
          console.log(`✅ Localização inserida com sucesso`);
        }

        // Inserir restrições (se houver)
        if (restrictions.length > 0) {
          console.log(
            `🚫 Inserindo ${restrictions.length} restrições para restaurante ID: ${restaurantId}`
          );
          const restrictionData = restrictions.map((restrictionId) => ({
            restaurant_id: restaurantId,
            restriction_id: restrictionId,
          }));

          console.log("🚫 Dados das restrições:", restrictionData);

          const { error: restrictionError } = await supabase
            .from("restaurant_restriction")
            .insert(restrictionData);

          if (restrictionError) {
            console.error(
              `❌ Erro ao inserir restrições do restaurante ${restaurantFields.name}:`,
              restrictionError
            );
            // Não parar aqui, continuar com o próximo
          } else {
            console.log(`✅ Restrições inseridas com sucesso`);
          }
        }

        console.log(
          `✅ Restaurante ${restaurantFields.name} inserido com sucesso!`
        );
      }

      console.log("🎉 Seed de restaurantes concluído com sucesso!");
    } catch (error) {
      console.error("❌ Erro durante o seed:", error);
      throw error;
    }
  }
}
