'use client'
import { useState } from "react";

export default function Newsletter() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ message: "", success: false });

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.target);
    const data = Object.fromEntries(form.entries());

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus({
          message: "✅ Você foi inscrito na nossa newsletter!",
          success: true,
        });
        e.target.reset();
      } else {
        setStatus({
          message: "❌ Falha ao inscrever. Tente novamente.",
          success: false,
        });
      }
    } catch (err) {
      setStatus({
        message: "⚠️ Ocorreu um erro. Tente novamente mais tarde.",
        success: false,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 mt-2 w-full max-w-sm">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="email"
          name="email"
          placeholder="voce@exemplo.com"
          required
          className="flex-1 border px-3 py-1 bg-white text-gray-800 
            focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-40 py-1 border bg-green-600 text-white 
            hover:bg-green-700 transition-colors"
        >
          {loading ? "Enviando..." : "Enviar"}
        </button>
      </form>

      {status.message && (
        <p
          className={`mt-2 ${status.success ? "text-green-600" : "text-red-600"
            }`}
        >
          {status.message}
        </p>
      )}
    </div>
  );
}
