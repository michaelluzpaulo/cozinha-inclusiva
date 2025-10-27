import { Client } from "@/Contracts/Client";
import {
  validateLoginAction,
  getClientByIdAction,
  emailExistsAction,
  resetPasswordAction,
} from "@/Actions/auth-actions";
import {
  validateLoginActionFallback,
  getClientByIdActionFallback,
  emailExistsActionFallback,
  resetPasswordActionFallback,
} from "@/Actions/auth-actions-fallback";

export class AuthAction {
  // Login com email e senha usando bcrypt via Server Action
  static async login(email: string, senha: string): Promise<Client | null> {
    console.log("🔍 AuthAction.login chamado com:", { email, senha: "***" });

    try {
      // Tentar primeiro com Drizzle
      const credentials = { email, password: senha };
      console.log("📤 Enviando para validateLoginAction:", credentials);

      const authenticatedClient = await validateLoginAction(credentials);

      if (authenticatedClient) {
        // Converter para formato Client esperado pela aplicação
        return {
          id: authenticatedClient.id,
          nome: authenticatedClient.nome,
          email: authenticatedClient.email,
          password: "", // Não retornar senha por segurança
          active: authenticatedClient.active,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Client;
      }
    } catch (error) {
      console.log("⚠️ Drizzle falhou, tentando fallback Supabase...");

      // Se Drizzle falhar, usar fallback Supabase
      try {
        const fallbackCredentials = { email, password: senha };
        console.log(
          "📤 Enviando para validateLoginActionFallback:",
          fallbackCredentials
        );

        const authenticatedClient = await validateLoginActionFallback(
          fallbackCredentials
        );
        if (authenticatedClient) {
          return {
            id: authenticatedClient.id,
            nome: authenticatedClient.nome,
            email: authenticatedClient.email,
            password: "",
            active: authenticatedClient.active,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          } as Client;
        }
      } catch (fallbackError) {
        console.error("❌ Fallback também falhou:", fallbackError);
      }
    }

    return null;
  }

  // Buscar client por ID (para validar sessões)
  static async getClientById(id: number): Promise<Client | null> {
    try {
      const client = await getClientByIdAction(id);

      if (client) {
        return {
          id: client.id,
          nome: client.nome,
          email: client.email,
          password: "",
          active: client.active,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as Client;
      }
    } catch (error) {
      console.log("⚠️ Drizzle falhou, tentando fallback para getClientById...");

      try {
        const client = await getClientByIdActionFallback(id);

        if (client) {
          return {
            id: client.id,
            nome: client.nome,
            email: client.email,
            password: "",
            active: client.active,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          } as Client;
        }
      } catch (fallbackError) {
        console.error(
          "❌ Fallback getClientById também falhou:",
          fallbackError
        );
      }
    }

    return null;
  }

  // Verificar se email existe para recuperação de senha
  static async checkEmailExists(email: string): Promise<boolean> {
    try {
      return await emailExistsAction(email);
    } catch (error) {
      console.log(
        "⚠️ Drizzle falhou, tentando fallback para checkEmailExists..."
      );
      return await emailExistsActionFallback(email);
    }
  }

  // Resetar senha (gerar nova senha temporária com hash)
  static async resetPassword(email: string): Promise<string | null> {
    try {
      return await resetPasswordAction(email);
    } catch (error) {
      console.log("⚠️ Drizzle falhou, tentando fallback para resetPassword...");
      return await resetPasswordActionFallback(email);
    }
  }
}
