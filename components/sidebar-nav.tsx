"use client";

import type React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Users, Trophy, School, MapPin, Users2, Dog, Bone } from "lucide-react";
import { cn } from "@/lib/utils";

export function SidebarNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view") || "usuarios"; // Obtiene el parámetro "view"

  // Definimos las secciones del menú
  const navItems = [
    { href: "escuelas", title: "Escuelas", icon: School },
    { href: "categorias", title: "Categorias", icon: School },
    { href: "grados", title: "Grados", icon: School },
    { href: "competencias", title: "Competencias", icon: Trophy },
    { href: "pistas", title: "Pistas", icon: MapPin },
    { href: "usuarios", title: "Usuarios", icon: Users },
    { href: "razas", title: "Razas", icon: Bone },
    { href: "perros", title: "Perros", icon: Dog },
    { href: "parejas", title: "Parejas", icon: Users2 },
    { href: "resultados", title: "Resultados", icon: Bone },
  ];

  return (
    <nav className={cn("flex flex-col space-y-1", className)} {...props}>
      {navItems.map(({ href, title, icon: Icon }) => (
        <Link
          key={href}
          href={`/admin?view=${href}`}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all",
            "hover:bg-[#F4F4F5] hover:text-[#6366F1]",
            currentView === href && "bg-[#6366F1] text-white" // 🔹 Resaltar seleccionado
          )}
        >
          <Icon className="h-4 w-4" />
          {title}
        </Link>
      ))}
    </nav>
  );
}
