import HeaderMenu from "@/components/HeaderMenu";
import Image from "next/image";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { notFound } from "next/navigation";
import { FindRecipeAction, Recipe } from "@/Actions/Recipe/FindRecipeAction";
import { GetRecipeFavoritesAction } from "@/Actions/Recipe/GetRecipeFavoritesAction";
import { FaHeart } from "react-icons/fa";

const receita = {
  id: 1,
  img: "/restaurante01.jpg",
  title: "Restaurante A",
  text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum Lorem Ipsum is simply dummy text of the printing and typesetting industry.Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
  type: "Vegano",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

interface RecipeWithStats extends Recipe {
  favoritesCount: number;
}

async function getRecipeWithStats(id: string): Promise<RecipeWithStats | null> {
  try {
    const recipe = await FindRecipeAction.execute(Number(id));
    if (!recipe) return null;

    const favoritesCount = await GetRecipeFavoritesAction.execute(recipe.id);
    return { ...recipe, favoritesCount };
  } catch (error) {
    console.error("Erro ao buscar receita:", error);
    return null;
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const recipeData = await getRecipeWithStats(id);

  if (!recipeData) {
    notFound();
  }
  return (
    <>
      <HeaderMenu />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Receita", href: "/receita" },
        ]}
      />
      <main className="flex flex-col gap-4 mt-8 mb-8 mx-auto">
        <section className="containerBox">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{recipeData.title}</h1>
            </div>
            <div className="flex items-center gap-2 text-red-500">
              <FaHeart className="text-xl" />
              <span className="font-semibold">{recipeData.favoritesCount}</span>
              <span className="text-sm text-gray-600">curtidas</span>
            </div>
          </div>
          <div>
            {/* Imagem flutuando só no desktop */}
            <div className="md:float-left md:w-[500px] md:mr-6 md:mb-2">
              <Image
                src={recipeData.img || "/prato01.jpg"}
                alt={recipeData.title}
                width={500}
                height={300}
                className="w-full h-auto object-cover rounded-md"
              />
            </div>

            {/* Texto ÚNICO que flui ao lado e depois abaixo em largura total */}
            <p className="text-gray-700 leading-relaxed text-justify">
              {recipeData.description || "Receita deliciosa e cheia de sabor."}
            </p>

            {/* Evita que o conteúdo seguinte “suba” ao lado da imagem flutuada */}
            <div className="clear-both"></div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
