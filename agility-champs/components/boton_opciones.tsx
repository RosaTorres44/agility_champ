"use client";
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

export function GradoButton({ selectedOption, setSelectedOption }: { selectedOption: string | null; setSelectedOption: (option: string) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-white hover:bg-gray-50">
          {selectedOption || "Todos los Grados"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setSelectedOption("Todos los Grados")}>Todos los Grados</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSelectedOption("Grado 0")}>Grado 0</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSelectedOption("Grado 1")}>Grado 1</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSelectedOption("Grado 2")}>Grado 2</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSelectedOption("Grado 3")}>Grado 3</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function CategoriaButton({ selectedOption, setSelectedOption }: { selectedOption: string | null; setSelectedOption: (option: string) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-white hover:bg-gray-50">
          {selectedOption || "Todas las Categorias"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setSelectedOption("Todas las Categorias")}>Todas las Categorias</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSelectedOption("Small")}>Small</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSelectedOption("Medium")}>Medium</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSelectedOption("Large")}>Large</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
