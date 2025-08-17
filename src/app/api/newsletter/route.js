import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: 'Email é obrigatório' }), {
        status: 400
      });
    }

    // Configuração do transporte
    const transporter = nodemailer.createTransport({
      host: process.env.EMAILTRAP_HOST,
      port: process.env.EMAILTRAP_PORT,
      auth: {
        user: process.env.EMAILTRAP_USER,
        pass: process.env.EMAILTRAP_PASS
      }
    });

    // Conteúdo do e-mail
    await transporter.sendMail({
      from: '"Newsletter Teste" <teste@mailtrap.io>',
      to: email,
      subject: 'Confirmação de Inscrição',
      text: 'Obrigado por se inscrever na nossa newsletter!',
      html: '<strong>Obrigado por se inscrever na nossa newsletter!</strong>'
    });

    return new Response(
      JSON.stringify({ message: 'Email enviado com sucesso!' }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Erro ao enviar o email' }), {
      status: 500
    });
  }
}
