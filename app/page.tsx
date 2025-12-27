"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Rankings } from "@/components/rankings";
import { Competitions } from "@/components/competitions";
import { Pie } from "@/components/Pie";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const verificarRegistro = async () => {
      if (status === "authenticated") {
        try {
          const correo = session?.user?.email;
          const res = await fetch(`/api/personas?correo=${correo}`);
          const data = await res.json();

          if (!data || data.length === 0) {
            router.replace("/registro");
          } else {
            setCargando(false); // ✅ Usuario registrado
          }
        } catch (error) {
          console.error("❌ Error al verificar registro:", error);
          router.replace("/registro");
        }
      } else if (status === "unauthenticated") {
        setCargando(false); // ✅ Usuario no autenticado, pero no redirigimos
      }
    };

    verificarRegistro();
  }, [status, session, router]);

  if (status === "loading" || cargando) {
    return <div className="p-8">Cargando...</div>;
  }

  return (
    <main className="min-h-screen bg-white overflow-auto">
      <Nav className="block sm:block md:block lg:block" />
      <Hero />
      <Rankings filter="active" />
      <Competitions filter="active" />
      <Pie />
    </main>
  );
}
