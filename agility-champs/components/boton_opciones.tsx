"use client";
import { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

interface DropdownFilterProps {
  label: string;
  endpoint: string;
  selectedOption: string | null;
  setSelectedOption: (option: string) => void;
  filter?: "active" | "all";
  competitionId?: number | null;
}

export function DropdownFilter({ label, endpoint, selectedOption, setSelectedOption, filter = "all", competitionId }: DropdownFilterProps) {
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    fetchData(endpoint, filter, competitionId)
      .then(data => setOptions(data.map((item: { Nombre: string }) => item.Nombre)))
      .catch(error => console.error(`Error al cargar ${label.toLowerCase()}:`, error));
  }, [endpoint, label, filter, competitionId]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-white hover:bg-gray-50">
          {selectedOption || label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setSelectedOption(label)}>{label}</DropdownMenuItem>
        {options.map((option) => (
          <DropdownMenuItem key={option} onClick={() => setSelectedOption(option)}>
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

async function fetchData(endpoint: string, filter?: "active" | "all", competitionId?: number | null) {
  let url = `/api/${endpoint}`;

  if (endpoint === "pistas") {
    const compId = filter === "active" ? await getActiveCompetitionId() : competitionId;
    if (compId) url = `/api/pistas?competencia_id=${compId}`;
  }

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error al obtener los datos de ${endpoint}`);
  return response.json();
}

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
