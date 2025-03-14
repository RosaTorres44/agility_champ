"use client";
import type React from "react";
import Link from "next/link";
import { Users, Trophy, School, MapPin, Users2, Dog, Bone, Dumbbell, Stethoscope, UtensilsCrossed } from "lucide-react";
import { cn } from "@/lib/utils";

export function SidebarNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav className={cn("flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1", className)} {...props}>
      {/* Usuarios */}
       

      {/* Competencias */}
      <Link
        href="/admin?view=competencias"
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-[#F4F4F5] hover:text-[#6366F1]"
      >
        <Trophy className="h-4 w-4" />
        Competencias
      </Link>

      {/* Escuelas */}
      <Link
        href="/admin?view=escuelas"
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-[#F4F4F5] hover:text-[#6366F1]"
      >
        <School className="h-4 w-4" />
        Escuelas
      </Link>

      {/* Pistas */}
      <Link
        href="/admin?view=pistas"
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-[#F4F4F5] hover:text-[#6366F1]"
      >
        <MapPin className="h-4 w-4" />
        Pistas
      </Link>

      {/* Parejas */}
      <Link
        href="/admin?view=parejas"
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-[#F4F4F5] hover:text-[#6366F1]"
      >
        <Users2 className="h-4 w-4" />
        Parejas
      </Link>

      {/* 🐶 Sección de Perros */}
      <Link
        href="/admin?view=perros"
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-[#F4F4F5] hover:text-[#6366F1]"
      >
        <Dog className="h-4 w-4" />
        Perros
      </Link>

      {/* 🦴 Razas */}
      <Link
        href="/admin?view=razas"
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-[#F4F4F5] hover:text-[#6366F1]"
      >
        <Bone className="h-4 w-4" />
        Razas
      </Link>

      {/* 🏋️‍♂️ Entrenamiento */}
      <Link
        href="/admin?view=entrenamiento"
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-[#F4F4F5] hover:text-[#6366F1]"
      >
        <Dumbbell className="h-4 w-4" />
        Entrenamiento
      </Link>

      {/* 🏥 Veterinario */}
      <Link
        href="/admin?view=veterinario"
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-[#F4F4F5] hover:text-[#6366F1]"
      >
        <Stethoscope className="h-4 w-4" />
        Veterinario
      </Link>

      {/* 🍖 Comida */}
      <Link
        href="/admin?view=comida"
        className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-[#F4F4F5] hover:text-[#6366F1]"
      >
        <UtensilsCrossed className="h-4 w-4" />
        Comida
      </Link>
    </nav>
  );
}
