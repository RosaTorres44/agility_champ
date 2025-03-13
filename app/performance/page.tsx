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
  const [selectedCompetencia, setSelectedCompetencia] = useState("Competencia");
  const [selectedPista, setSelectedPista] = useState("Pista");

  const [guias, setGuias] = useState<string[]>([]);
  const [perrosPorGuia, setPerrosPorGuia] = useState<Record<string, string[]>>({});
  const [perros, setPerros] = useState<string[]>([]);
  const [competencias, setCompetencias] = useState<string[]>([]);
  const [pistas, setPistas] = useState<string[]>([]);

  // 🔹 Cargar Guías desde la API
  useEffect(() => {
    async function loadGuias() {
      try {
        const data = await fetchData("personas"); // 🔹 API corregida
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
        const data = await fetchData("perros_por_guia"); // 🔹 API corregida
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
        setCompetencias(["Competencia", ...data.map((comp: { nombre: string }) => comp.nombre)]);
      } catch (error) {
        console.error("Error cargando competencias:", error);
      }
    }
    loadCompetencias();
  }, []);

  // 🔹 Cargar Pistas desde la API
  useEffect(() => {
    async function loadPistas() {
      try {
        const data = await fetchData("pistas");
        setPistas(["Pista", ...data.map((pista: { nombre: string }) => pista.nombre)]);
      } catch (error) {
        console.error("Error cargando pistas:", error);
      }
    }
    loadPistas();
  }, []);

  // 🔹 Cargar perros cuando cambia la Guía seleccionada
  useEffect(() => {
    if (selectedGuia !== "Guía" && perrosPorGuia[selectedGuia]) {
      setPerros(perrosPorGuia[selectedGuia]); // Carga los perros de la guía seleccionada
    } else {
      setPerros(["Perro"]); // Opción por defecto
    }
    setSelectedPerro("Perro");
  }, [selectedGuia, perrosPorGuia]);

  // 🔹 Cargar competencias cuando cambia el Perro seleccionado
  useEffect(() => {
    setSelectedCompetencia("Competencia");
  }, [selectedPerro]);

  // 🔹 Cargar pistas cuando cambia la Competencia seleccionada
  useEffect(() => {
    setSelectedPista("Pista");
  }, [selectedCompetencia]);

  return (
    <main className="min-h-screen bg-white">
      <Nav />
      <Header_nav title="Mis Resultados" />

      {/* Sección de Filtros */}
      <div className="flex p-4 gap-4">
        <div className="w-1/4 bg-white p-4 rounded-lg shadow-md flex flex-col space-y-4">
          <h2 className="text-lg font-semibold mb-2">Filtrar por:</h2>

          {/* Filtros */}
          <FiltroDropdown label="Guía" opciones={guias} selected={selectedGuia} setSelected={setSelectedGuia} />
          {selectedGuia !== "Guía" && (
            <FiltroDropdown label="Perro" opciones={perros} selected={selectedPerro} setSelected={setSelectedPerro} />
          )}
          {selectedPerro !== "Perro" && <FiltroDropdown label="Competencia" opciones={competencias} selected={selectedCompetencia} setSelected={setSelectedCompetencia} />}
          {selectedCompetencia !== "Competencia" && <FiltroDropdown label="Pista" opciones={pistas} selected={selectedPista} setSelected={setSelectedPista} />}
        </div>

        {/* Resultados */}
        <div className="w-3/4 bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Resultados</h2>
          <TablaResultados
            guia={selectedGuia === "Guía" ? null : selectedGuia}
            perro={selectedPerro === "Perro" ? null : selectedPerro}
            competencia={selectedCompetencia === "Competencia" ? null : selectedCompetencia}
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
      <span className="text-gray-600 font-medium">{label}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={`w-[250px] h-[45px] text-center truncate ${selected === label ? "font-bold" : ""}`}>
            {selected}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[250px]">
          {opciones.map((opcion) => (
            <DropdownMenuItem key={opcion} onClick={() => setSelected(opcion)}>
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
    return {};
  }
}
