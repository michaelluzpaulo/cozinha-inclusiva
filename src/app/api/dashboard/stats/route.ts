import { GetDashboardStatsAction } from "@/Actions/Dashboard/GetDashboardStatsAction";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const stats = await GetDashboardStatsAction.execute();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}