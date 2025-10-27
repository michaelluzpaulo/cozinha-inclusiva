"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthActionSimple } from "@/Actions/Auth/AuthActionSimple";
import { useAuth } from "@/contexts/AuthContext";
import HeaderMenu from "@/components/HeaderMenu";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
    lembrarSenha: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const client = await AuthActionSimple.login(
        formData.email,
        formData.senha
      );

      if (client) {
        login(client);

        // Se marcou "lembrar senha", salvar no localStorage
        if (formData.lembrarSenha) {
          localStorage.setItem("rememberedEmail", formData.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        router.push("/area-restrita/dashboard");
      } else {
        setError("Email ou senha inválidos, ou conta inativa.");
      }
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.");
      console.error("Erro no login:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordLoading(true);
    setForgotPasswordMessage("");

    try {
      const emailExists = await AuthActionSimple.checkEmailExists(
        forgotPasswordEmail
      );

      if (!emailExists) {
        setForgotPasswordMessage("❌ Email não encontrado ou conta inativa.");
        return;
      }

      const tempPassword = await AuthActionSimple.resetPassword(
        forgotPasswordEmail
      );

      if (tempPassword) {
        setForgotPasswordMessage(
          `✅ Nova senha temporária: ${tempPassword}\n` +
            "Guarde esta senha e faça login para alterá-la."
        );
      } else {
        setForgotPasswordMessage("❌ Erro ao resetar senha. Tente novamente.");
      }
    } catch (err) {
      setForgotPasswordMessage("❌ Erro inesperado. Tente novamente.");
      console.error("Erro ao resetar senha:", err);
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // Carregar email lembrado quando componente monta
  useEffect(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: rememberedEmail,
        lembrarSenha: true,
      }));
    }
  }, []);

  return (
    <>
      <HeaderMenu />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Área Restrita", href: "/area-restrita/signin" },
        ]}
      />

      <main className="flex flex-col gap-4 mt-8 mb-8 mx-auto containerBox max-w-xl">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-6">Área Restrita</h1>
          <p className="text-gray-600 text-center mb-6">
            Faça login para acessar sua conta
          </p>

          {!showForgotPassword ? (
            <>
              {/* Formulário de Login */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="seu@email.com"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="senha"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Senha
                  </label>
                  <input
                    id="senha"
                    name="senha"
                    type="password"
                    value={formData.senha}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        senha: e.target.value,
                      }))
                    }
                    placeholder="Sua senha"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.lembrarSenha}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          lembrarSenha: e.target.checked,
                        }))
                      }
                      className="mr-2 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-600">Lembrar email</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-green-600 hover:text-green-700 hover:underline"
                  >
                    Esqueci minha senha
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Entrando..." : "Entrar"}
                </button>
              </form>

              {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
            </>
          ) : (
            <>
              {/* Formulário de Recuperação de Senha */}
              <div className="mb-4">
                <button
                  onClick={() => setShowForgotPassword(false)}
                  className="text-green-600 hover:text-green-700 text-sm flex items-center"
                >
                  ← Voltar ao login
                </button>
              </div>

              <h2 className="text-xl font-semibold mb-4">Recuperar Senha</h2>
              <p className="text-gray-600 mb-4 text-sm">
                Digite seu email para receber uma nova senha temporária.
              </p>

              <form
                onSubmit={handleForgotPassword}
                className="flex flex-col gap-4"
              >
                <div>
                  <label
                    htmlFor="forgotEmail"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    id="forgotEmail"
                    type="email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={forgotPasswordLoading}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {forgotPasswordLoading ? "Processando..." : "Recuperar Senha"}
                </button>
              </form>

              {forgotPasswordMessage && (
                <div
                  className={`mt-4 p-3 rounded whitespace-pre-line ${
                    forgotPasswordMessage.includes("✅")
                      ? "bg-green-100 border border-green-400 text-green-700"
                      : "bg-red-100 border border-red-400 text-red-700"
                  }`}
                >
                  {forgotPasswordMessage}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
