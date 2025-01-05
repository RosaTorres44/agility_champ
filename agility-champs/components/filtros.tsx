"use client";
import { GradoButton, CategoriaButton } from './boton_opciones';

interface FiltrosProps {
  gradoFilter: string | null;
  setGradoFilter: (value: string | null) => void;
  categoriaFilter: string | null;
  setCategoriaFilter: (value: string | null) => void;
}

export function Filtros({ gradoFilter, setGradoFilter, categoriaFilter, setCategoriaFilter }: FiltrosProps) {
  return (
    <div className="flex gap-4 justify-center my-8">
      <CategoriaButton selectedOption={categoriaFilter} setSelectedOption={setCategoriaFilter} />
      <GradoButton selectedOption={gradoFilter} setSelectedOption={setGradoFilter} />
    </div>
  );
}
