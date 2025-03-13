"use client";

import { useState, useEffect } from "react";
import { Header_nav } from "@/components/header_nav";
import { Nav } from "@/components/nav";
import { Pie } from "@/components/Pie";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { TablaResultados } from "@/components/TablaResultados";

export const dynamic = "force-dynamic";

const opcionesIniciales = {
  guias: ["Guía", "Rosita", "Laura", "Mario"],
  perros: {
    Rosita: ["Perro", "Zoé", "Hanna"],
    Laura: ["Perro", "Bruno"],
    Mario: ["Perro", "Maya"],
  },
  competencias: ["Competencia", "Open Speed Runners", "Agility Championship"],
  pistas: ["Pista", "Pista Técnica", "Pista Rápida"],
};

export default function PerformancePage() {
  const [selectedGuia, setSelectedGuia] = useState<keyof typeof opcionesIniciales.perros | "Guía">("Guía");
  const [selectedPerro, setSelectedPerro] = useState("Perro");
  const [selectedCompetencia, setSelectedCompetencia] = useState("Competencia");
  const [selectedPista, setSelectedPista] = useState("Pista");

  const [perros, setPerros] = useState<string[]>([]);
  const [competencias, setCompetencias] = useState<string[]>([]);
  const [pistas, setPistas] = useState<string[]>([]);

  useEffect(() => {
    setPerros(selectedGuia !== "Guía" ? opcionesIniciales.perros[selectedGuia as keyof typeof opcionesIniciales.perros] || ["Perro"] : []);
    setSelectedPerro("Perro");
  }, [selectedGuia]);

  useEffect(() => {
    setCompetencias(selectedPerro !== "Perro" ? opcionesIniciales.competencias : []);
    setSelectedCompetencia("Competencia");
  }, [selectedPerro]);

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
          <FiltroDropdown label="Guía" opciones={opcionesIniciales.guias} selected={selectedGuia} setSelected={setSelectedGuia} />
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
function FiltroDropdown<T extends string>({ label, opciones, selected, setSelected }: { label: string; opciones: string[]; selected: T; setSelected: (value: T) => void }) {
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
            <DropdownMenuItem key={opcion} onClick={() => setSelected(opcion as T)}>
              {opcion}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
