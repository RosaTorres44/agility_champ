"use client";

import { useState, useEffect } from "react";
import { Header_nav } from "@/components/header_nav";
import { Nav } from "@/components/nav";
import { Pie } from "@/components/Pie";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { TablaResultados } from "@/components/TablaResultados";

export const dynamic = "force-dynamic";

export default function PerformancePage() {
  const [selectedGuia, setSelectedGuia] = useState("Guía");
  const [selectedPerro, setSelectedPerro] = useState("Perro");
  const [selectedCompetencia, setSelectedCompetencia] = useState({ id: 0, nombre: "Competencia" });
  const [selectedPista, setSelectedPista] = useState("Pista");

  const [guias, setGuias] = useState<string[]>([]);
  const [perrosPorGuia, setPerrosPorGuia] = useState<Record<string, string[]>>({});
  const [perros, setPerros] = useState<string[]>([]);
  const [competencias, setCompetencias] = useState<{ id: number; nombre: string }[]>([]);
  const [pistas, setPistas] = useState<{ id: number; nombre: string }[]>([]);

  // 🔹 Cargar Guías desde la API
  useEffect(() => {
    async function loadGuias() {
      try {
        const data = await fetchData("personas");
        const nombres = data.map((persona: { Nombre: string }) => persona.Nombre);
        setGuias(["Guía", ...nombres]);
      } catch (error) {
        console.error("Error cargando guías:", error);
      }
    }
    loadGuias();
  }, []);

  // 🔹 Cargar Perros por Guía desde la API
  useEffect(() => {
    async function loadPerros() {
      try {
        const data = await fetchData("perros_por_guia");
        setPerrosPorGuia(data);
      } catch (error) {
        console.error("Error cargando perros por guía:", error);
      }
    }
    loadPerros();
  }, []);

  // 🔹 Cargar Competencias desde la API
  useEffect(() => {
    async function loadCompetencias() {
      try {
        const data = await fetchData("competencias");
        setCompetencias([{ id: 0, nombre: "Competencia" }, ...data.map((comp: { id_competencia: number; nombre: string }) => ({
          id: comp.id_competencia,
          nombre: comp.nombre
        }))]);
      } catch (error) {
        console.error("Error cargando competencias:", error);
      }
    }
    loadCompetencias();
  }, []);

  // 🔹 Cargar Pistas cuando se selecciona una Competencia
  useEffect(() => {
    async function loadPistas() {
      if (!selectedCompetencia || selectedCompetencia.id === 0) {
        setPistas([{ id: 0, nombre: "Pista" }]); // Reseteamos pistas si no hay competencia
        return;
      }

      try {
        const data = await fetchData(`pistas?competencia_id=${selectedCompetencia.id}`);
        setPistas([{ id: 0, nombre: "Pista" }, ...data.map((pista: { id_pista: number; Nombre: string }) => ({
          id: pista.id_pista,
          nombre: pista.Nombre
        }))]);
      } catch (error) {
        console.error("Error cargando pistas:", error);
      }
    }

    loadPistas();
  }, [selectedCompetencia]);

  // 🔹 Cargar perros cuando cambia la Guía seleccionada
  useEffect(() => {
    if (selectedGuia !== "Guía" && perrosPorGuia[selectedGuia]) {
      setPerros(["Perro", ...perrosPorGuia[selectedGuia]]);
    } else {
      setPerros(["Perro"]);
    }
    setSelectedPerro("Perro");
  }, [selectedGuia, perrosPorGuia]);

  // 🔹 Resetear competencia al cambiar de perro
  useEffect(() => {
    setSelectedCompetencia({ id: 0, nombre: "Competencia" });
  }, [selectedPerro]);

  // 🔹 Resetear pista al cambiar de competencia
  useEffect(() => {
    setSelectedPista("Pista");
  }, [selectedCompetencia]);

  return (
    <main className="min-h-screen bg-white">
      <Nav />
      <Header_nav title="Mis Resultados" />

      {/* Sección de Filtros */}
      <div className="flex p-4 gap-6">
        <aside className="lg:w-1/5">
          <div className="flex flex-col space-y-4">
            {/* Filtros */}
            <FiltroDropdown label="Guía" opciones={guias} selected={selectedGuia} setSelected={setSelectedGuia} />
            {selectedGuia !== "Guía" && (
              <FiltroDropdown label="Perro" opciones={perros} selected={selectedPerro} setSelected={setSelectedPerro} />
            )}
            {selectedPerro !== "Perro" && (
              <FiltroDropdown
                label="Competencia"
                opciones={competencias.map((comp) => comp.nombre)}
                selected={selectedCompetencia.nombre}
                setSelected={(nombre) => {
                  const compSeleccionada = competencias.find((comp) => comp.nombre === nombre);
                  setSelectedCompetencia(compSeleccionada || { id: 0, nombre: "Competencia" });
                }}
              />
            )}
            {selectedCompetencia.id !== 0 && (
              <FiltroDropdown
                label="Pista"
                opciones={pistas.map((pista) => pista.nombre)}
                selected={selectedPista}
                setSelected={setSelectedPista}
              />
            )}
          </div>
        </aside>

        {/* Resultados */}
        <div className="bg-white p-6 rounded-lg shadow-md text-sm">
          <h2 className="text-md font-semibold mb-3">Resultados</h2>
          <TablaResultados
            guia={selectedGuia === "Guía" ? null : selectedGuia}
            perro={selectedPerro === "Perro" ? null : selectedPerro}
            competencia={selectedCompetencia.id === 0 ? null : selectedCompetencia.nombre}
            pista={selectedPista === "Pista" ? null : selectedPista}
          />
        </div>


      </div>
      <Pie />
    </main>
  );
}

/** 🔹 Componente reutilizable para los filtros */
function FiltroDropdown({ label, opciones, selected, setSelected }: { label: string; opciones: string[]; selected: string; setSelected: (value: string) => void }) {
  return (
    <div className="flex flex-col">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={`w-[250px] h-[45px] text-center truncate ${selected === label ? "font-bold" : ""}`}>
            {selected}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[250px]">
          {opciones.map((opcion) => (
            <DropdownMenuItem key={opcion} onClick={() => setSelected(opcion)} className="hover:bg-indigo-100 hover:text-indigo-700">
              {opcion}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

/** 🔹 Función para obtener datos de la API */
async function fetchData(endpoint: string) {
  try {
    const response = await fetch(`/api/${endpoint}`);
    if (!response.ok) throw new Error(`Error al obtener los datos de ${endpoint}`);
    return response.json();
  } catch (error) {
    console.error(`Error en fetchData(${endpoint}):`, error);
    return [];
  }
}
