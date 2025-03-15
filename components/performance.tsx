"use client";

import { useState, useEffect, useCallback } from "react";
import { FiltrosResultados } from "@/components/FiltrosResultados";
import { TablaResultados } from "@/components/TablaResultados";

export function Performance() {
  const [selectedGuia, setSelectedGuia] = useState("Guía");
  const [selectedPerro, setSelectedPerro] = useState("Perro");
  const [selectedCompetencia, setSelectedCompetencia] = useState({ id: 0, nombre: "Competencia" });
  const [selectedPista, setSelectedPista] = useState("Pista");

  const [guias, setGuias] = useState<string[]>(["Guía"]);
  const [perrosPorGuia, setPerrosPorGuia] = useState<Record<string, string[]>>({});
  const [perros, setPerros] = useState<string[]>(["Perro"]);
  const [competencias, setCompetencias] = useState<{ id: number; nombre: string }[]>([{ id: 0, nombre: "Competencia" }]);
  const [pistas, setPistas] = useState<{ id: number; nombre: string }[]>([{ id: 0, nombre: "Pista" }]);

  const fetchData = useCallback(async (endpoint: string) => {
    try {
      const response = await fetch(`/api/${endpoint}`);
      if (!response.ok) throw new Error(`Error al obtener datos de ${endpoint}`);
      return await response.json();
    } catch (error) {
      console.error(`Error en fetchData(${endpoint}):`, error);
      return [];
    }
  }, []);

  useEffect(() => {
    (async () => {
      const [guiasData, perrosData, competenciasData] = await Promise.all([
        fetchData("personas"),
        fetchData("perros_por_guia"),
        fetchData("competencias"),
      ]);

      setGuias(["Guía", ...guiasData.map((persona: { Nombre: string }) => persona.Nombre)]);
      setPerrosPorGuia(perrosData);
      setCompetencias([{ id: 0, nombre: "Competencia" }, ...competenciasData.map((comp: { id_competencia: number; nombre: string }) => ({
        id: comp.id_competencia,
        nombre: comp.nombre
      }))]);
    })();
  }, [fetchData]);

  useEffect(() => {
    setPerros(["Perro", ...(perrosPorGuia[selectedGuia] || [])]);
    setSelectedPerro("Perro");
  }, [selectedGuia, perrosPorGuia]);

  useEffect(() => {
    setSelectedCompetencia({ id: 0, nombre: "Competencia" });
  }, [selectedPerro]);

  useEffect(() => {
    if (selectedCompetencia.id === 0) {
      setPistas([{ id: 0, nombre: "Pista" }]);
    } else {
      (async () => {
        const pistasData = await fetchData(`pistas?competencia_id=${selectedCompetencia.id}`);
        setPistas([{ id: 0, nombre: "Pista" }, ...pistasData.map((pista: { id_pista: number; Nombre: string }) => ({
          id: pista.id_pista,
          nombre: pista.Nombre
        }))]);
      })();
    }
  }, [selectedCompetencia, fetchData]);

  useEffect(() => {
    setSelectedPista("Pista");
  }, [selectedCompetencia]);

  return (
    <div className="flex flex-col p-4 gap-6">
      {/* 📌 Contenedor de filtros en fila */}
      <aside className="flex flex-row flex-wrap gap-4 w-full overflow-x-auto">
        <FiltrosResultados
          guias={guias} perros={perros} competencias={competencias} pistas={pistas}
          selectedGuia={selectedGuia} setSelectedGuia={setSelectedGuia}
          selectedPerro={selectedPerro} setSelectedPerro={setSelectedPerro}
          selectedCompetencia={selectedCompetencia} setSelectedCompetencia={setSelectedCompetencia}
          selectedPista={selectedPista} setSelectedPista={setSelectedPista}
        />
      </aside>

      {/* 📌 Tabla de resultados */}
      <div className="bg-white p-6 rounded-lg shadow-md text-sm flex-1 overflow-auto">
        <h2 className="text-md font-semibold mb-3">Resultados</h2>
        <div className="overflow-x-auto">
          <TablaResultados
            guia={selectedGuia === "Guía" ? null : selectedGuia}
            perro={selectedPerro === "Perro" ? null : selectedPerro}
            competencia={selectedCompetencia.id === 0 ? null : selectedCompetencia.nombre}
            pista={selectedPista === "Pista" ? null : selectedPista}
          />
        </div>
      </div>
    </div>
  );
}
