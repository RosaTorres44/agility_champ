"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SidebarNav } from "@/components/sidebar-nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Nav } from "@/components/nav";
import { Header_nav } from "@/components/header_nav";
import { Pie } from "@/components/Pie";
import { AdminMaestroTabla } from "@/components/admin-maestro-table";
import { DynamicForm } from "@/components/admin-maestro-form";

export const dynamic = "force-dynamic";

// 🔹 Definir títulos dinámicos según `view`
const TITLES: Record<string, string> = {
  usuarios: "Usuarios",
  escuelas: "Escuelas",
  resultados: "Resultados",
};

function AdminContent() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view")?.toLowerCase() || "resultados";
  const pageTitle = TITLES[view] || "Administrar";

  const [escuelas, setEscuelas] = useState<{ id: number; name: string; active: boolean }[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{ id: number; name: string; active: boolean } | null>(null);

  async function fetchEscuelas() {
    try {
      setLoading(true);
      const response = await fetch("/api/escuelas");
      if (!response.ok) throw new Error("Error al obtener las escuelas");

      const data = await response.json();

      // 🔹 Convertir datos correctamente
      const formattedEscuelas = data.map((escuela: { id: number; name: string; active: number }) => ({
        id: escuela.id,
        name: escuela.name,
        active: Boolean(escuela.active), // Convertir a booleano
      }));

      setEscuelas(formattedEscuelas);
    } catch (err) {
      console.error("Error al obtener las escuelas:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (view === "escuelas") {
      fetchEscuelas();
    }
  }, [view]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav />
          </aside>
          <div className="flex-1 lg:max-w-4xl">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold tracking-tight">{pageTitle}</h1>
              <Button
                className="bg-[#6366F1] hover:bg-[#4F46E5]"
                onClick={() => {
                  setSelectedUser(null);
                  setShowForm(true);
                }}
              >
                {showForm && !selectedUser ? "Cancelar" : `Agregar Nueva ${pageTitle}`}
              </Button>
            </div>
            {showForm && <DynamicForm reloadData={fetchEscuelas} selectedUser={selectedUser} />}
            <Tabs defaultValue="actives" className="space-y-4">
              <TabsList className="bg-transparent border-b border-[#E5E7EB] w-full justify-start h-auto p-0 space-x-6">
                <TabsTrigger value="actives">Activas</TabsTrigger>
                <TabsTrigger value="inactives">Inactivas</TabsTrigger>
              </TabsList>
              <TabsContent value="actives">
                <AdminMaestroTabla 
                  users={escuelas.filter((e) => e.active)} 
                  onEdit={(user) => {
                    setSelectedUser(user);
                    setShowForm(true);
                  }} 
                />
              </TabsContent>
              <TabsContent value="inactives">
                <AdminMaestroTabla 
                  users={escuelas.filter((e) => !e.active)} 
                  onEdit={(user) => {
                    setSelectedUser(user);
                    setShowForm(true);
                  }} 
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-white">
      <Nav />
      <Header_nav title="Administrar" />
      <Suspense fallback={<div>Cargando...</div>}>
        <AdminContent />
      </Suspense>
      <Pie />
    </main>
  );
}
