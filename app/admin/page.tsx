"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SidebarNav } from "@/components/sidebar-nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Nav } from "@/components/nav";
import { Header_nav } from "@/components/header_nav";
import { Pie } from "@/components/Pie";
import { AdminMaestroTabla } from "@/components/admin-maestro-table"; // 🔹 Reutilizado para mostrar Escuelas también
import { UserForm } from "@/components/admin-maestro-form"; // 🔹 Manteniendo formulario

export const dynamic = "force-dynamic"; // 🔹 Permite recargar dinámicamente

// 🔹 Definir títulos dinámicos según el `view` de la URL
const TITLES: Record<string, string> = {
  usuarios: "Usuarios",
  competencias: "Competencias",
  escuelas: "Escuelas",
  pistas: "Pistas",
  duplas: "Duplas",
  perros: "Perros",
  razas: "Razas",
  entrenamiento: "Entrenamiento",
  veterinarios: "Veterinarios",
  alimentacion: "Alimentación",
};

export default function AdminPage() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "usuarios"; // 🔹 Obtiene el `view` de la URL
  const pageTitle = TITLES[view] || "Administrar"; // 🔹 Obtiene el título de la vista actual
  const [showForm, setShowForm] = useState(false); // 🔹 Estado para mostrar/ocultar formulario

  const [users, setUsers] = useState([
    { id: "1", name: "Alice Johnson", email: "alice.johnson@example.com", role: "Admin", active: true },
    { id: "2", name: "Bob Smith", email: "bob.smith@example.com", role: "Editor", active: false },
    { id: "3", name: "Charlie Brown", email: "charlie.brown@example.com", role: "Viewer", active: true },
    { id: "4", name: "Diana Prince", email: "diana.prince@example.com", role: "Admin", active: false },
  ]);

  const [escuelas, setEscuelas] = useState<{ id: string; name: string; active: boolean }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Obtener las escuelas desde la API si la vista es "escuelas"
  useEffect(() => {
    if (view !== "escuelas") return;

    async function fetchEscuelas() {
      try {
        setLoading(true);
        const response = await fetch("/api/escuelas"); // 🔹 Reemplazar con la URL real de la API
        if (!response.ok) throw new Error("Error al obtener las escuelas");

        const data = await response.json();
        const formattedEscuelas = data.map((escuela: { Nombre: string; flg_activo: number }, index: number) => ({
          id: (index + 1).toString(), // 🔹 Genera un ID temporal
          name: escuela.Nombre,
          active: escuela.flg_activo === 1,
        }));

        setEscuelas(formattedEscuelas);
      } catch (err) {
        setError("Error al obtener las escuelas");
      } finally {
        setLoading(false);
      }
    }

    fetchEscuelas();
  }, [view]);

  // 🔹 Filtrar datos según el estado activo/inactivo
  const activeItems = view === "escuelas" ? escuelas.filter((e) => e.active) : users.filter((u) => u.active);
  const inactiveItems = view === "escuelas" ? escuelas.filter((e) => !e.active) : users.filter((u) => !u.active);

  return (
    <main className="min-h-screen bg-white">
      <Nav />
      <Header_nav title="Administrar" />
      <div className="flex flex-col min-h-screen">
        <div className="hidden space-y-6 p-10 pb-16 md:block">
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="-mx-4 lg:w-1/5">
              <SidebarNav />
            </aside>
            <div className="flex-1 lg:max-w-4xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-bold tracking-tight">{pageTitle}</h1>
                </div>
                <Button
                  className="bg-[#6366F1] hover:bg-[#4F46E5]"
                  onClick={() => setShowForm(!showForm)} // 🔹 Mostrar u ocultar el formulario
                >
                  {showForm ? `Cancelar` : `Agregar Nueva ${pageTitle}`}
                </Button>
              </div>
              <Tabs defaultValue="actives" className="space-y-4">

                  {/* 🔹 Formulario solo si `showForm` es true */}
                  {showForm && (
                    <div className="rounded-md border p-6 bg-[#F9FAFB]">
                      <h2 className="text-lg font-medium mb-4">Detalle</h2>
                      <UserForm />
                    </div>
                  )}


                <TabsList className="bg-transparent border-b border-[#E5E7EB] w-full justify-start h-auto p-0 space-x-6">
                  <TabsTrigger
                    value="actives"
                    className="text-sm data-[state=active]:text-[#6366F1] data-[state=active]:border-[#6366F1] rounded-none border-b-2 border-transparent px-0 pb-4"
                  >
                    Activas
                  </TabsTrigger>
                  <TabsTrigger
                    value="inactives"
                    className="text-sm data-[state=active]:text-[#6366F1] data-[state=active]:border-[#6366F1] rounded-none border-b-2 border-transparent px-0 pb-4"
                  >
                    Inactivas
                  </TabsTrigger>
                </TabsList>

                {/* 🔹 Tabla de Activos */}
                <TabsContent value="actives" className="space-y-6">
                  {loading ? (
                    <p className="text-gray-500">Cargando {pageTitle.toLowerCase()}...</p>
                  ) : error ? (
                    <p className="text-red-500">{error}</p>
                  ) : activeItems.length > 0 ? (
                    <AdminMaestroTabla users={activeItems} /> // 🔹 Se usa la misma tabla para usuarios y escuelas
                  ) : (
                    <p className="text-gray-500">No hay {pageTitle.toLowerCase()} activas.</p>
                  )}

               
                </TabsContent>

                {/* 🔹 Tabla de Inactivos */}
                <TabsContent value="inactives" className="space-y-6">
                  {loading ? (
                    <p className="text-gray-500">Cargando {pageTitle.toLowerCase()}...</p>
                  ) : error ? (
                    <p className="text-red-500">{error}</p>
                  ) : inactiveItems.length > 0 ? (
                    <AdminMaestroTabla users={inactiveItems} /> // 🔹 Reutiliza la misma tabla
                  ) : (
                    <p className="text-gray-500">No hay {pageTitle.toLowerCase()} inactivas.</p>
                  )}

                
                </TabsContent>

              </Tabs>
            </div>
          </div>
        </div>
      </div>
      <Pie />
    </main>
  );
}
