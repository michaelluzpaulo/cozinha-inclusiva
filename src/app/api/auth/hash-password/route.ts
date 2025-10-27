import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { hash: null, error: "Password is required" },
        { status: 400 }
      );
    }

    const hash = await bcrypt.hash(password, 12);

    return NextResponse.json({ hash });
  } catch (error) {
    console.error("Error hashing password:", error);
    return NextResponse.json(
      { hash: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
