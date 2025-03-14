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
  usuarios: "Usuarios",
  escuelas: "Escuelas",
  resultados: "Resultados",
};

// 🔹 Definir el tipo para una escuela
interface Escuela {
  id: number;
  name: string;
  active: boolean;
}

// 🔹 Definir tipos para el reducer
type AdminState = {
  showForm: boolean;
  selectedUser: Escuela | null;
};

type AdminAction =
  | { type: "EDIT_USER"; payload: Escuela }
  | { type: "NEW_USER" }
  | { type: "CLOSE_FORM" };

// 🔹 Reducer para manejar el estado del formulario y usuario seleccionado
const initialState: AdminState = { showForm: false, selectedUser: null };

function reducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    case "EDIT_USER":
      return { showForm: true, selectedUser: action.payload };
    case "NEW_USER":
      return { showForm: true, selectedUser: null };
    case "CLOSE_FORM":
      return { showForm: false, selectedUser: null }; // ✅ Restablecer también `selectedUser`
    default:
      return state;
  }
}

function AdminContent() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view")?.toLowerCase() || "resultados";
  const pageTitle = TITLES[view] || "Administrar";
  const [state, dispatch] = useReducer(reducer, initialState);
  const [escuelas, setEscuelas] = useState<Escuela[]>([]);

  // 🔹 Función optimizada para obtener escuelas
  const fetchEscuelas = useCallback(async () => {
    try {
      const response = await fetch("/api/escuelas");
      if (!response.ok) throw new Error("Error al obtener las escuelas");
      const data = await response.json();
      setEscuelas(
        data.map((e: { id: number; name: string; active: number }) => ({
          id: e.id,
          name: e.name,
          active: Boolean(e.active),
        }))
      );
    } catch (err) {
      console.error("Error al obtener las escuelas:", err);
    }
  }, []);

  useEffect(() => {
    if (view === "escuelas") fetchEscuelas();
  }, [view, fetchEscuelas]);

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
                onClick={() => dispatch(state.showForm ? { type: "CLOSE_FORM" } : { type: "NEW_USER" })}
              >
                {state.showForm ? "Cancelar" : `Agregar Nueva ${pageTitle}`}
              </Button>
            </div>
            {state.showForm && (
              <DynamicForm
                reloadData={fetchEscuelas}
                selectedUser={state.selectedUser}
                onCancel={() => dispatch({ type: "CLOSE_FORM" })}
              />
            )}
            <AdminTableSection escuelas={escuelas} dispatch={dispatch} />
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
