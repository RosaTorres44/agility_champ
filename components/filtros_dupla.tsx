"use client";
 
import { DropdownFilter } from "./boton_opciones";

interface FiltrosProps {
  personaFilter: string | null;
  setPersonaFilter: (value: string | null) => void;
  perroFilter: string | null;
  setPerroFilter: (value: string | null) => void;
  filter?: "active" | "all";
  competitionId?: number | null;
}

export function Filtros_Duplas({ personaFilter, setPersonaFilter, perroFilter, setPerroFilter}: FiltrosProps) { 

  return (
    <div className="flex gap-4 justify-center my-8">
      <DropdownFilter label="Personas" endpoint="personas" selectedOption={personaFilter} setSelectedOption={setPersonaFilter} />
      <DropdownFilter label="Perros" endpoint="perros" selectedOption={perroFilter} setSelectedOption={setPerroFilter} />
    </div>
  );
}
 
