"use client";

import { useEffect, useCallback, useReducer, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SidebarNav } from "@/components/sidebar-nav";
import { AdminTableSection } from "@/components/AdminTableSection";
import { DynamicForm } from "@/components/admin-maestro-form";
import { Menu } from "lucide-react";
import { AdminHeader } from "@/components/AdminHeader";
import { MobileSidebar } from "@/components/MobileSidebar";
import { useSession } from "next-auth/react";

const TITLES: Record<string, string> = {
  escuelas: "Escuelas",
  categorias: "Categorias",
  competencias: "Competencias",
  grados: "Grados",
  razas: "Razas",
  perros: "Perros",
  usuarios: "Usuarios",
  personas: "Personas",
  pistas: "Pistas",
  parejas: "Parejas",
  resultados: "Resultados",
};

const ADMIN_ALLOWED = Object.keys(TITLES);
const JUEZ_ALLOWED = ["pistas", "resultados"];

type AdminState = { showForm: boolean; selectedEntity: any | null };
type AdminAction =
  | { type: "EDIT_ENTITY"; payload: any }
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

export default function AdminComponent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawView = searchParams.get("view")?.toLowerCase() || "resultados";
  const entityType = rawView.replace("inactivas", "").trim();

  const role = session?.user?.role || "";
  const allowedViews =
    role === "Admin" ? ADMIN_ALLOWED : role === "Juez" ? JUEZ_ALLOWED : [];

  const pageTitle = TITLES[entityType] ?? "Administrar";

  const [state, dispatch] = useReducer(reducer, initialState);
  const [entities, setEntities] = useState<any[]>([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchEntities = useCallback(async () => {
    try {
      setLoading(true);
      const isInactivas = rawView.includes("inactivas");
      const url = `/api/${entityType}${["escuelas", "razas", "grados", "categorias"].includes(entityType) ? `?flg_activo=${isInactivas ? 0 : 1}` : ""}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Error al obtener ${entityType}`);
      const data = await response.json();

      const adapt = {
        perros: (e: any) => ({
          id: e.id,
          nombre: e.nombre,
          fec_nacimiento: e.fec_nacimiento,
          sexo: e.sexo,
          chip: e.chip,
          id_raza: e.id_raza,
          raza: e.raza,
          flg_activo: !!e.flg_activo,
        }),
        personas: (e: any) => ({
          id: e.id,
          nombre: e.nombre || e.name || "",
          apellidos: e.apellidos || e.name || "",
          fec_nacimiento: e.fec_nacimiento,
          flg_sexo: e.flg_sexo,
          sexo: e.flg_sexo === 1 ? "Hombre" : "Mujer",
          email: e.email || "",
          role: e.role || "Usuario",
          flg_activo: !!e.flg_activo,
        }),
        competencias: (e: any) => ({
          id: e.id,
          nombre: e.nombre,
          escuela: e.escuela,
          id_escuela: e.id_escuela,
          fec_inicio: e.fec_inicio,
          fec_fin: e.fec_fin,
          flg_activo: !!e.flg_activo,
        }),
        pistas: (e: any) => ({
          id: e.id_pista,
          nombre: e.nombre,
          competencia: e.competencia,
          grado: e.grado,
          categoria: e.categoria,
          juez: e.juez,
          id_competencia: e.id_competencia,
          id_grado: e.id_grado,
          id_categoria: e.id_categoria,
          id_persona: e.id_persona,
          num_obstaculos: e.num_obstaculos,
          num_longitud: e.num_longitud,
          num_velocidad_maxima: e.num_velocidad_maxima,
          num_velocidad_minima: e.num_velocidad_minima,
          num_tiempo_maximo: e.num_tiempo_maximo,
          num_tiempo_minimo: e.num_tiempo_minimo,
          des_tipo: e.des_tipo,
          flg_activo: !!e.flg_activo,
        }),
        default: (e: any) => ({
          id: e.id,
          nombre: e.nombre,
          flg_activo: !!e.flg_activo,
        }),
      };

      const adapter = adapt[entityType as keyof typeof adapt] || adapt.default;
      const adaptados = data.map(adapter);
      setEntities(adaptados);
    } catch (err) {
      console.error(`❌ Error al obtener ${entityType}:`, err);
    } finally {
      setLoading(false);
    }
  }, [entityType, rawView]);

  useEffect(() => {
    if (status === "authenticated") {
      const allowed = allowedViews.includes(entityType);
      if (!allowed) {
        router.replace("/");
      } else {
        fetchEntities();
      }
    }
  }, [status, entityType, allowedViews, router, fetchEntities]);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  if (loading || status === "loading") {
    return <p className="p-4 text-gray-500">Cargando...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex justify-between items-center p-4 border-b md:hidden">
        <h1 className="text-lg font-bold">{pageTitle}</h1>
        {isMobile && (
          <button onClick={() => setSidebarOpen(true)} className="text-gray-700">
            <Menu size={24} />
          </button>
        )}
      </div>

      <div className="flex flex-1">
        <aside className="hidden md:block md:w-1/5 border-r p-4">
          <SidebarNav onSelect={() => setSidebarOpen(false)} />
        </aside>

        <MobileSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 p-4 md:p-10 bg-white min-h-screen">
          <AdminHeader
            title={pageTitle}
            showForm={state.showForm}
            onToggleForm={() =>
              dispatch(state.showForm ? { type: "CLOSE_FORM" } : { type: "NEW_ENTITY" })
            }
          />

          {state.showForm && (
            <DynamicForm
              entityType={pageTitle}
              reloadData={fetchEntities}
              selectedEntity={state.selectedEntity}
              onCancel={() => dispatch({ type: "CLOSE_FORM" })}
            />
          )}
          <AdminTableSection
            entityType={pageTitle}
            entities={entities}
            dispatch={dispatch}
          />
        </div>
      </div>
    </div>
  );
}
