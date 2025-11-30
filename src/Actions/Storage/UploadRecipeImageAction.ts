import { createClient } from "@/lib/supabase/client";

export class UploadRecipeImageAction {
  static async execute(
    file: File,
    recipeId?: number,
    customFileName?: string
  ): Promise<string> {
    const supabase = createClient();

    // Validar tipo de arquivo
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Apenas arquivos JPG, PNG e WebP são permitidos");
    }

    // Validar tamanho (máx 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error("Arquivo muito grande. Tamanho máximo: 5MB");
    }

    const fileExt = file.name.split(".").pop()?.toLowerCase();
    const fileName = customFileName
      ? `recipes/${customFileName}.${fileExt}`
      : recipeId
      ? `recipes/recipe_${recipeId}_${Date.now()}.${fileExt}`
      : `recipes/${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;

    // Upload da imagem
    const { data, error } = await supabase.storage
      .from("cozinha_inclusiva")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      throw new Error(`Erro ao fazer upload da imagem: ${error.message}`);
    }

    // Retornar a URL pública
    const { data: publicData } = supabase.storage
      .from("cozinha_inclusiva")
      .getPublicUrl(data.path);

    return publicData.publicUrl;
  }

  // Método para deletar imagem
  static async delete(imagePath: string): Promise<boolean> {
    const supabase = createClient();

    // Extrair o path do arquivo da URL
    const path = imagePath.split("/").slice(-2).join("/");

    const { error } = await supabase.storage
      .from("cozinha_inclusiva")
      .remove([path]);

    if (error) {
      console.error("Erro ao deletar imagem:", error);
      return false;
    }

    return true;
  }
}
