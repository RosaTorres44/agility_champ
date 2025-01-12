"use client";
import { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';


export function GradoButton({ selectedOption, setSelectedOption }: { selectedOption: string | null; setSelectedOption: (option: string) => void }) {
  const [grados, setGrados] = useState<string[]>([]);

  useEffect(() => {
    async function loadGrados() {
      try {
        const data = await fetchData('grados');
        setGrados(data.map((grado: { Nombre: string }) => grado.Nombre));
      } catch (error) {
        console.error("Error al cargar los grados:", error);
      }
    }
    loadGrados();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-white hover:bg-gray-50">
          {selectedOption || "Todos los Grados"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setSelectedOption("Todos los Grados")}>Todos los Grados</DropdownMenuItem>
        {grados.map((grado) => (
          <DropdownMenuItem key={grado} onClick={() => setSelectedOption(grado)}>
            {grado}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


export function CategoriaButton({ selectedOption, setSelectedOption }: { selectedOption: string | null; setSelectedOption: (option: string) => void }) {
const [categorias, setCategorias] = useState<string[]>([]);


  useEffect(() => {
    async function loadCategorias() {
      try {
        const data = await fetchData('categorias');
        setCategorias(data.map((grado: { Nombre: string }) => grado.Nombre));
      } catch (error) {
        console.error("Error al cargar las categorias:", error);
      }
    }
    loadCategorias();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-white hover:bg-gray-50">
          {selectedOption || "Todas las Cagegorias"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setSelectedOption("Todas las Cagegorias")}>Todas las Cagegorias</DropdownMenuItem>
        {categorias.map((categoria) => (
          <DropdownMenuItem key={categoria} onClick={() => setSelectedOption(categoria)}>
            {categoria}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

async function fetchData(endpoint: string) {
  const response = await fetch(`/api/${endpoint}`); // Ruta dinámica basada en el parámetro
  if (!response.ok) {
    throw new Error(`Error al obtener los datos de ${endpoint}`);
  }
  return response.json();
}
