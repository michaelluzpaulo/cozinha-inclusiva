import { createClient } from "@/lib/supabase/client";

export class UploadImageAction {
  static async execute(
    file: File,
    bucket: string = "cozinha_inclusiva",
    folder: string = "recipes",
    customFileName?: string
  ): Promise<string> {
    const supabase = createClient();

    // Gerar nome único para o arquivo
    const fileExt = file.name.split(".").pop();
    const fileName = customFileName
      ? `${folder}/${customFileName}.${fileExt}`
      : `${folder}/${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true, // Permite sobrescrever se já existir
      });

    if (error) {
      throw new Error(`Erro ao fazer upload da imagem: ${error.message}`);
    }

    // Retornar a URL pública da imagem
    const { data: publicData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicData.publicUrl;
  }
}
