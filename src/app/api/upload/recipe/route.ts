import { NextRequest, NextResponse } from "next/server";
import { UploadRecipeImageAction } from "@/Actions/Storage/UploadRecipeImageAction";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const recipeId = formData.get("recipeId") as string;
    const customFileName = formData.get("customFileName") as string;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo foi enviado" },
        { status: 400 }
      );
    }

    const imageUrl = await UploadRecipeImageAction.execute(
      file,
      recipeId ? Number(recipeId) : undefined,
      customFileName || undefined
    );

    return NextResponse.json({
      message: "Upload realizado com sucesso!",
      imageUrl,
    });
  } catch (error) {
    console.error("Erro no upload:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}

// DELETE - Deletar imagem
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imagePath = searchParams.get("imagePath");

    if (!imagePath) {
      return NextResponse.json(
        { error: "Path da imagem é obrigatório" },
        { status: 400 }
      );
    }

    const success = await UploadRecipeImageAction.delete(imagePath);

    if (!success) {
      return NextResponse.json(
        { error: "Erro ao deletar imagem" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Imagem deletada com sucesso!",
    });
  } catch (error) {
    console.error("Erro ao deletar imagem:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
