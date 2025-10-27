"use client";

import { useState, useEffect, ReactNode } from "react";

interface HydrationWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Componente para evitar problemas de hidratação
 * Só renderiza children após a hidratação estar completa
 */
export default function HydrationWrapper({
  children,
  fallback,
}: HydrationWrapperProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-2 text-gray-600 text-sm">Carregando...</p>
          </div>
        </div>
      )
    );
  }

  return <>{children}</>;
}
