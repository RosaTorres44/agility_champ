"use client";
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
  return (
    <div className="flex gap-4 justify-center my-8">
      <DropdownFilter label="Categorías" endpoint="categorias" selectedOption={categoriaFilter} setSelectedOption={setCategoriaFilter} />
      <DropdownFilter label="Grados" endpoint="grados" selectedOption={gradoFilter} setSelectedOption={setGradoFilter} />
      <DropdownFilter label="Pistas" endpoint="pistas" selectedOption={pistaFilter} setSelectedOption={setPistaFilter} filter={filter} competitionId={competitionId} />
    </div>
  );
}
