"use client";

import { Suspense, useEffect, useCallback, useReducer, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SidebarNav } from "@/components/sidebar-nav";
import { Nav } from "@/components/nav";
import { Header_nav } from "@/components/header_nav";
import { Pie } from "@/components/Pie";
import { AdminTableSection } from "@/components/AdminTableSection";
import { DynamicForm } from "@/components/admin-maestro-form";

export const dynamic = "force-dynamic";

// 🔹 Diccionario de títulos por vista
const TITLES: Record<string, string> = {
  escuelas: "Escuelas",
  categorias: "Categorias",
  competencias: "Competencias",
  grados: "Grados",
  razas: "Razas",
  usuarios: "Usuarios",
  resultados: "Resultados",
};

// 🔹 Definir el tipo para una entidad
interface Entidad {
  id: number;
  name: string;
  active: boolean;
}

// 🔹 Reducer para manejar el estado del formulario y entidad seleccionada
type AdminState = { showForm: boolean; selectedEntity: Entidad | null };

type AdminAction =
  | { type: "EDIT_ENTITY"; payload: Entidad }
  | { type: "NEW_ENTITY" }
  | { type: "CLOSE_FORM" };

const initialState: AdminState = { showForm: false, selectedEntity: null };

function reducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    case "EDIT_ENTITY":
      return { showForm: true, selectedEntity: action.payload };
    case "NEW_ENTITY":
      return { showForm: true, selectedEntity: null };
    case "CLOSE_FORM":
      return { showForm: false, selectedEntity: null };
    default:
      return state;
  }
}

function AdminContent() {
  const searchParams = useSearchParams();
  const entityType = searchParams.get("view")?.toLowerCase() || "resultados";
  const pageTitle = TITLES[entityType] || "Administrar";
  const [state, dispatch] = useReducer(reducer, initialState);
  const [entities, setEntities] = useState<Entidad[]>([]);

  // 🔹 Función para obtener datos dinámicamente según la entidad seleccionada
  const fetchEntities = useCallback(async () => {
    try {
      const response = await fetch(`/api/${entityType}`);
      if (!response.ok) throw new Error(`Error al obtener ${entityType}`);
      const data = await response.json();
      setEntities(
        data.map((e: { id: number; name: string; active: number }) => ({
          id: e.id,
          name: e.name,
          active: Boolean(e.active),
        }))
      );
    } catch (err) {
      console.error(`Error al obtener ${entityType}:`, err);
    }
  }, [entityType]);

  useEffect(() => {
    fetchEntities();
  }, [entityType, fetchEntities]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav />
          </aside>
          <div className="flex-1 lg:max-w-4xl">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold tracking-tight">{pageTitle}</h1>
              <Button
                className="bg-[#6366F1] hover:bg-[#4F46E5]"
                onClick={() => dispatch(state.showForm ? { type: "CLOSE_FORM" } : { type: "NEW_ENTITY" })}
              >
                {state.showForm ? "Cancelar" : `Agregar Nueva ${pageTitle}`}
              </Button>
            </div>
            {state.showForm && (
              <DynamicForm
                entityType={pageTitle} // ✅ Se pasa el tipo de entidad correctamente
                reloadData={fetchEntities}
                selectedEntity={state.selectedEntity}
                onCancel={() => dispatch({ type: "CLOSE_FORM" })}
              />
            )}
           <AdminTableSection entityType={pageTitle} entities={entities} dispatch={dispatch} />


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