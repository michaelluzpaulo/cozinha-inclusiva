import { SeedRestaurantsAction } from "@/Actions/Seed/SeedRestaurantsAction";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await SeedRestaurantsAction.execute();
    return NextResponse.json({ 
      success: true, 
      message: "Seed de restaurantes executado com sucesso!" 
    });
  } catch (error) {
    console.error("Erro no seed:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Erro ao executar seed de restaurantes",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    );
  }
}