"use client";

import { useEffect, useCallback, useReducer, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SidebarNav } from "@/components/sidebar-nav";
import { AdminTableSection } from "@/components/AdminTableSection";
import { DynamicForm } from "@/components/admin-maestro-form";
import { Menu, X } from "lucide-react";

const TITLES: Record<string, string> = {
  escuelas: "Escuelas",
  categorias: "Categorias",
  competencias: "Competencias",
  grados: "Grados",
  razas: "Razas",
  usuarios: "Usuarios",
  resultados: "Resultados",
};

interface Entidad {
  id: number;
  name: string;
  active: boolean;
}

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

export function Admin() {
  const searchParams = useSearchParams();
  const entityType = searchParams.get("view")?.toLowerCase() || "resultados";
  const pageTitle = TITLES[entityType] || "Administrar";
  const [state, dispatch] = useReducer(reducer, initialState);
  const [entities, setEntities] = useState<Entidad[]>([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  // Detectar si es móvil para mostrar la hamburguesa
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Encabezado con botón de hamburguesa solo en móviles */}
      <div className="flex justify-between items-center p-4 border-b md:hidden">
        <h1 className="text-lg font-bold">{pageTitle}</h1>
        {isMobile && (
          <button onClick={() => setSidebarOpen(true)} className="text-gray-700">
            <Menu size={24} />
          </button>
        )}
      </div>

      <div className="flex flex-1">
        {/* Sidebar en pantallas grandes */}
        <aside className="hidden md:block md:w-1/5 lg:w-1/4 xl:w-1/5 border-r p-4">
          <SidebarNav />
        </aside>

        {/* Sidebar en móviles (modal deslizable) */}
        {isMobile && isSidebarOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex">
            <div className="w-3/4 max-w-sm bg-white shadow-md p-6">
              <button onClick={() => setSidebarOpen(false)} className="text-gray-600 mb-4 flex items-center gap-2">
                <X size={20} /> Cerrar
              </button>
              <SidebarNav />
            </div>
            <div className="flex-1" onClick={() => setSidebarOpen(false)}></div>
          </div>
        )}

        {/* Contenido principal */}
        <div className="flex-1 p-4 md:p-10">
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
              entityType={pageTitle}
              reloadData={fetchEntities}
              selectedEntity={state.selectedEntity}
              onCancel={() => dispatch({ type: "CLOSE_FORM" })}
            />
          )}

          <AdminTableSection entityType={pageTitle} entities={entities} dispatch={dispatch} />
        </div>
      </div>
    </div>
  );
}
