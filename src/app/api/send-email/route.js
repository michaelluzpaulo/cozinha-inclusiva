import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { name, email, phone, message } = await req.json();

    // Configuração do transporte
    const transporter = nodemailer.createTransport({
      host: process.env.EMAILTRAP_HOST,
      port: process.env.EMAILTRAP_PORT,
      auth: {
        user: process.env.EMAILTRAP_USER,
        pass: process.env.EMAILTRAP_PASS
      }
    });

    // Envio do email
    await transporter.sendMail({
      from: `"Formulário Site" <no-reply@seudominio.com>`,
      to: 'destinatario@teste.com',
      subject: 'Novo contato do site',
      text: `
        Nome: ${name}
        Email: ${email}
        Telefone: ${phone}
        Mensagem: ${message}
      `
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
