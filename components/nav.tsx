"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { LoginButton } from "@/components/LoginButton";
import { useSession } from "next-auth/react";

interface NavProps {
  className?: string;
}

export function Nav({ className }: NavProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isJuez = session?.user?.role === "Juez";

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <nav className={`border-b ${className || ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8">
                <Image
                  src="/logo.jpeg"
                  alt="Agility Champs Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              </div>
              <span className="font-semibold text-xl">Agility Champs</span>
            </Link>
          </div>

          {/* Menú en pantallas grandes */}
          {!isMobile && (
            <div className="flex gap-4">
              <Link
                href="/"
                className={`px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 ${
                  pathname === "/" ? "text-indigo-600" : "text-gray-500"
                }`}
              >
                Inicio
              </Link>
              <Link
                href="/competitions"
                className={`px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 ${
                  pathname === "/competitions" ? "text-indigo-600" : "text-gray-500"
                }`}
              >
                Competencias
              </Link>
              <Link
                href="/performance"
                className={`px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 ${
                  pathname === "/performance" ? "text-indigo-600" : "text-gray-500"
                }`}
              >
                Mi Desempeño
              </Link>

              {isJuez && (
                <Link
                  href="/admin?view=resultados"
                  className={`px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 ${
                    pathname === "/admin" ? "text-indigo-600" : "text-gray-500"
                  }`}
                >
                  Administrar
                </Link>
              )}
            </div>
          )}

          {/* Botón de Login en pantallas grandes */}
          {!isMobile && <LoginButton />}
          
          {/* Botón de hamburguesa en móviles */}
          {isMobile && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-700 focus:outline-none"
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          )}
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {isMobile && menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-md z-50">
          <div className="flex flex-col items-start p-4 space-y-2">
            <Link href="/" className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
              Inicio
            </Link>
            <Link href="/competitions" className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
              Competencias
            </Link>
            <Link href="/performance" className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
              Mi Desempeño
            </Link>
            {isJuez && (
              <Link href="/admin?view=resultados" className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100" onClick={() => setMenuOpen(false)}>
                Administrar
              </Link>
            )}
            <LoginButton onLoginClick={() => setMenuOpen(false)} />
          </div>
        </div>
      )}
    </nav>
  );
}
