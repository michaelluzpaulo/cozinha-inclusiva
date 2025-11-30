import { NextRequest, NextResponse } from "next/server";
import { FindUserAction } from "@/Actions/User/FindUserAction";
import { UpdateUserAction } from "@/Actions/User/UpdateUserAction";
import { DeleteUserAction } from "@/Actions/User/DeleteUserAction";

// GET - Buscar usuário por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = Number(id);
    if (!userId) {
      return NextResponse.json(
        { error: "ID do usuário inválido" },
        { status: 400 }
      );
    }

    const user = await FindUserAction.execute(userId);
    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// PUT - Atualizar usuário
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = Number(id);
    if (!userId) {
      return NextResponse.json(
        { error: "ID do usuário inválido" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, email, password, roleId, active } = body;

    const updateData: any = { id: userId };
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (password) updateData.password = password;
    if (roleId !== undefined) updateData.roleId = Number(roleId);
    if (active !== undefined) updateData.active = active;

    const updatedUser = await UpdateUserAction.execute(updateData);

    return NextResponse.json({
      message: "Usuário atualizado com sucesso!",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}

// DELETE - Desativar usuário
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = Number(id);
    if (!userId) {
      return NextResponse.json(
        { error: "ID do usuário inválido" },
        { status: 400 }
      );
    }

    const success = await DeleteUserAction.execute(userId);
    if (!success) {
      return NextResponse.json(
        { error: "Erro ao desativar usuário" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Usuário desativado com sucesso!",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Erro interno do servidor",
      },
      { status: 500 }
    );
  }
}
