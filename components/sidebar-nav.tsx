"use client";

import type React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Users, Trophy, School, MapPin, Users2, Dog, Bone } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  onSelect?: () => void;
}

export function SidebarNav({ className, onSelect, ...props }: SidebarNavProps) {
  const searchParams = useSearchParams();
  const currentView = searchParams.get("view") || "usuarios";

  const navItems = [
    { href: "escuelas", title: "Escuelas", icon: School },
    { href: "categorias", title: "Categorias", icon: School },
    { href: "grados", title: "Grados", icon: School },
    { href: "razas", title: "Razas", icon: Bone },
    { href: "personas", title: "Personas", icon: Users },
    { href: "perros", title: "Perros", icon: Dog },
    { href: "competencias", title: "Competencias", icon: Trophy },
    { href: "pistas", title: "Pistas", icon: MapPin },
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
            currentView === href && "bg-[#6366F1] text-white"
          )}
          onClick={onSelect} // 👉 se ejecuta al hacer clic
        >
          <Icon className="h-4 w-4" />
          {title}
        </Link>
      ))}
    </nav>
  );
}
