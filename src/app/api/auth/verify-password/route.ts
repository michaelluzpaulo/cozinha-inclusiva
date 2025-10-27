import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { password, hash } = await request.json();

    if (!password || !hash) {
      return NextResponse.json(
        { valid: false, error: "Password and hash are required" },
        { status: 400 }
      );
    }

    const isValid = await bcrypt.compare(password, hash);

    return NextResponse.json({ valid: isValid });
  } catch (error) {
    console.error("Error verifying password:", error);
    return NextResponse.json(
      { valid: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
