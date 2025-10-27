"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  redirectTo = "/area-restrita/signin",
}: ProtectedRouteProps) {
  const { client, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !client) {
      router.push(redirectTo);
    }
  }, [client, isLoading, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return null; // Será redirecionado pelo useEffect
  }

  return <>{children}</>;
}
