"use client";

import { useState, useEffect } from "react";
import { Header_nav } from "@/components/header_nav";
import { Nav } from "@/components/nav";
import { Pie } from "@/components/Pie";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { TablaResultados } from "@/components/TablaResultados";

export const dynamic = "force-dynamic";

type OpcionesIniciales = {
  perros: { [key: string]: string[] };
  competencias: string[];
  pistas: string[];
};

const opcionesIniciales: OpcionesIniciales = {
  perros: {
    Laura: ["Perro", "Bruno"],
    Mario: ["Perro", "Maya"],
  },
  competencias: ["Competencia", "Open Speed Runners", "Agility Championship"],
  pistas: ["Pista", "Pista Técnica", "Pista Rápida"],
};

export default function PerformancePage() {
  const [selectedGuia, setSelectedGuia] = useState("Guía");
  const [selectedPerro, setSelectedPerro] = useState("Perro");
  const [selectedCompetencia, setSelectedCompetencia] = useState("Competencia");
  const [selectedPista, setSelectedPista] = useState("Pista");

  const [guias, setGuias] = useState<string[]>([]);
  const [perros, setPerros] = useState<string[]>([]);
  const [competencias, setCompetencias] = useState<string[]>([]);
  const [pistas, setPistas] = useState<string[]>([]);

  // 🔹 Cargar Guías desde la API
  useEffect(() => {
    async function loadGuias() {
      try {
        const data = await fetchData("personas", "active");
        const nombres = data.map((persona: { Nombre: string }) => persona.Nombre);
        setGuias(["Guía", ...nombres]); // Agrega "Guía" como opción inicial
        setPerros(selectedGuia !== "Guía" ? opcionesIniciales.perros[selectedGuia as keyof typeof opcionesIniciales.perros] || ["Perro"] : []);
      } catch (error) {
        console.error("Error cargando guías:", error);
      }
    }
    loadGuias();
  }, []);

  // 🔹 Cargar perros según la guía seleccionada
  useEffect(() => {
    setPerros(selectedGuia !== "Guía" ? opcionesIniciales.perros[selectedGuia] || ["Perro"] : []);
    setSelectedPerro("Perro");
  }, [selectedGuia]);

  // 🔹 Cargar competencias según el perro seleccionado
  useEffect(() => {
    setCompetencias(selectedPerro !== "Perro" ? opcionesIniciales.competencias : []);
    setSelectedCompetencia("Competencia");
  }, [selectedPerro]);

  // 🔹 Cargar pistas según la competencia seleccionada
  useEffect(() => {
    setPistas(selectedCompetencia !== "Competencia" ? opcionesIniciales.pistas : []);
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
          {selectedGuia !== "Guía" && <FiltroDropdown label="Perro" opciones={perros} selected={selectedPerro} setSelected={setSelectedPerro} />}
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
async function fetchData(endpoint: string, filter?: "active" | "all", competitionId?: number | null) {
  let url = `/api/${endpoint}`;

  if (filter === "active") {
    url += "?active=1";
  } else if (competitionId) {
    url += `?competitionId=${competitionId}`;
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error al obtener los datos de ${endpoint}`);
  return response.json();
}
