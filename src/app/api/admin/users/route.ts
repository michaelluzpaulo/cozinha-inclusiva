import { NextRequest, NextResponse } from "next/server";
import { GetAllUsersAction } from "@/Actions/User/GetAllUsersAction";
import { CreateUserAction } from "@/Actions/User/CreateUserAction";

// GET - Listar usuários
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get("active");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");

    const params: any = {};
    if (active !== null) params.active = active === "true";
    if (limit) params.limit = Number(limit);
    if (offset) params.offset = Number(offset);

    const users = await GetAllUsersAction.execute(params);
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// POST - Criar usuário
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, roleId } = body;

    if (!name || !email || !password || !roleId) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    const newUser = await CreateUserAction.execute({
      name,
      email,
      password,
      roleId: Number(roleId),
    });

    return NextResponse.json({
      message: "Usuário criado com sucesso!",
      user: newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}
