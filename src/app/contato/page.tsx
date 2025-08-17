'use client'
import { withMask } from "use-mask-input";
import { useState } from "react";
import HeaderMenu from "@/components/HeaderMenu";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("✅ E-mail enviado com sucesso!");
        e.target.reset(); // 🔹 Limpa os campos do formulário
      } else {
        setStatus("❌ Falha ao enviar e-mail.");
      }
    } catch (err) {
      setStatus("❌ Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <HeaderMenu />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Contato", href: "/contato" },
        ]}
      />
      <main className="flex flex-col gap-4 mt-8 mb-8 mx-auto containerBox">
        <h1 className="text-2xl font-bold">Entre em Contato</h1>
        <p className="text-gray-600">
          Se você tiver alguma dúvida ou sugestão, sinta-se à vontade para entrar em contato conosco!
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Nome + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input name="name" type="text" placeholder="Seu Nome" className="border p-2 rounded" required />
            <input name="email" type="email" placeholder="Seu Email" className="border p-2 rounded" required />
          </div>

          {/* Telefone */}
          <input
            name="phone"
            type="text"
            ref={withMask("(99) 99999-9999")}
            placeholder="Seu Telefone"
            className="border p-2 rounded sm:w-1/2"
          />

          {/* Mensagem */}
          <textarea name="message" placeholder="Sua Mensagem" className="border p-2 rounded" rows={4} required />

          {/* Botão */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700 transition w-72 min-w-[120px]"
            >
              {loading ? "Enviando..." : "Enviar"}
            </button>
          </div>
        </form>

        {status && <p className="text-center mt-2">{status}</p>}
      </main>
      <Footer />
    </>
  );
}
