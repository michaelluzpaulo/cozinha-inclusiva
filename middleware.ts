import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rotas que requerem autenticação
const protectedRoutes = ["/area-restrita/dashboard", "/admin"];

// Rotas públicas (não precisam de autenticação)
const publicRoutes = [
  "/area-restrita/signin",
  "/",
  "/receitas",
  "/restaurantes",
  "/contato",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verificar se é uma rota protegida
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Se for rota protegida, verificar autenticação
  if (isProtectedRoute) {
    // Em um middleware, não podemos acessar localStorage diretamente
    // Mas podemos verificar cookies ou headers se necessário

    // Por enquanto, deixamos a verificação para o componente ProtectedRoute
    // Este middleware pode ser expandido para verificar cookies JWT futuramente
    return NextResponse.next();
  }

  // Para rotas públicas, permitir acesso
  return NextResponse.next();
}

// Configurar quais rotas o middleware deve interceptar
export const config = {
  matcher: [
    /*
     * Corresponde a todos os caminhos de solicitação, exceto aqueles que começam com:
     * - api (rotas da API)
     * - _next/static (arquivos estáticos)
     * - _next/image (arquivos de imagem otimizados)
     * - favicon.ico (arquivo de favicon)
     * - arquivos estáticos públicos
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
