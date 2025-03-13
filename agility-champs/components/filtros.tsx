"use client";
import { useEffect, useState } from "react";
import { DropdownFilter } from './boton_opciones';

interface FiltrosProps {
  gradoFilter: string | null;
  setGradoFilter: (value: string | null) => void;
  categoriaFilter: string | null;
  setCategoriaFilter: (value: string | null) => void;
  pistaFilter: string | null;
  setPistaFilter: (value: string | null) => void;
  filter?: "active" | "all";
  competitionId?: number | null;
}

export function Filtros({ gradoFilter, setGradoFilter, categoriaFilter, setCategoriaFilter, pistaFilter, setPistaFilter, filter, competitionId }: FiltrosProps) {
  const [selectedCompetition, setSelectedCompetition] = useState<number | null>(competitionId ?? null);

  useEffect(() => {
    const fetchActiveCompetition = async () => {
      if (selectedCompetition === null) {
        const activeCompId = await getActiveCompetitionId();
        setSelectedCompetition(activeCompId);
        //alert(`🔍 ID de la competencia asignada: ${activeCompId !== null ? activeCompId : "Ninguna"}`);
      }
    };

    fetchActiveCompetition();
  }, [selectedCompetition]);

  return (
    <div className="flex gap-4 justify-center my-8">
      <DropdownFilter label="Categorías" endpoint="categorias" selectedOption={categoriaFilter} setSelectedOption={setCategoriaFilter} />
      <DropdownFilter label="Grados" endpoint="grados" selectedOption={gradoFilter} setSelectedOption={setGradoFilter} />
      <DropdownFilter label="Pistas" endpoint="pistas" selectedOption={pistaFilter} setSelectedOption={setPistaFilter} filter={filter} competitionId={selectedCompetition} />
    </div>
  );
}

// 🔹 Función para obtener la competencia activa
async function getActiveCompetitionId() {
  try {
    const response = await fetch("/api/competencias");
    if (!response.ok) throw new Error("Error al obtener las competencias");

    const data = await response.json();
    const activeCompetition = data.find((comp: any) => comp.flg_activo === 1);
    return activeCompetition ? activeCompetition.id_competencia : null;
  } catch (error) {
    console.error("Error al obtener la competencia activa:", error);
    return null;
  }
}
