// app/registro/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { DynamicForm } from "@/components/admin-maestro-form";

export default function RegistroPage() {
  const { data: session, status } = useSession();
  const [usuario, setUsuario] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    const cargarDatos = async () => {
      if (!session?.user?.email) return;

      try {
        const res = await fetch(`/api/personas?correo=${session.user.email}`);
        const data = await res.json();

        if (data && data.length > 0) {
          setUsuario(data[0]);
        }
      } catch (error) {
        console.error("Error al cargar datos del usuario:", error);
      }
    };

    if (status === "authenticated") {
      cargarDatos();
    }
  }, [session, status]);

  if (status === "loading") return <p>Cargando...</p>;
  if (!session?.user) return <p>No autorizado</p>;

  const selectedEntity = usuario ?? {
    nombre: session.user.name?.split(" ")[0] || "",
    apellidos: session.user.name?.split(" ").slice(1).join(" ") || "",
    email: session.user.email,
    flg_sexo: "0",
    fec_nacimiento: "",
    role: "Usuario",
    flg_activo: true,
  };

  console.log("🧪 selectedEntity:", selectedEntity);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Completa tu información</h1>
      <DynamicForm
        entityType="personas"
        selectedEntity={selectedEntity}
        reloadData={() => router.push("/")}
        onCancel={() => router.push("/")}
      />
    </div>
  );
}
