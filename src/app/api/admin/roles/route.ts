import { NextRequest, NextResponse } from "next/server";
import { GetAllRolesAction } from "@/Actions/User/GetAllRolesAction";

// GET - Listar roles
export async function GET(request: NextRequest) {
  try {
    const roles = await GetAllRolesAction.execute();
    return NextResponse.json({ roles });
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
