import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, tempPassword } = await request.json();

    // Aqui você pode integrar com um serviço de email como SendGrid, Resend, etc.
    // Por enquanto, vou simular o envio

    console.log(`Enviando senha temporária para ${email}: ${tempPassword}`);

    // Simular delay de envio
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Em produção, você faria algo como:
    // await sendEmail({
    //   to: email,
    //   subject: "Nova Senha Temporária - Cozinha Inclusiva",
    //   html: `
    //     <h2>Nova Senha Temporária</h2>
    //     <p>Sua nova senha temporária é: <strong>${tempPassword}</strong></p>
    //     <p>Faça login e altere sua senha o mais breve possível.</p>
    //   `
    // });

    return NextResponse.json({
      success: true,
      message: "Email enviado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return NextResponse.json(
      { success: false, message: "Erro ao enviar email" },
      { status: 500 }
    );
  }
}
