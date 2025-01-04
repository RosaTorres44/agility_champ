"use client";
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';

export  function GradoButton() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* Botón para mostrar las opciones */}
        <Button 
          variant="outline"
          className="bg-white hover:bg-gray-50"
        >
          {selectedOption || 'Todos los Grados'}
        </Button>
      </DropdownMenuTrigger>
      {/* Opciones del menú desplegable */}
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleSelect('Todos los Grados')}>Todos los Grados</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSelect('Grado 0')}>Grado 0</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSelect('Grado 1')}>Grado 1</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSelect('Grado 2 ')}>Grado 2 </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSelect('Grado 3 ')}>Grado 3 </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export  function CategoriaButton() {
  const [selectedOptionC, setSelectedOptionC] = useState<string | null>(null);

  const handleSelectC = (option: string) => {
    setSelectedOptionC(option);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* Botón para mostrar las opciones */}
        <Button 
          variant="outline"
          className="bg-white hover:bg-gray-50"
        >
          {selectedOptionC || 'Todas las Categorias'}
        </Button>
      </DropdownMenuTrigger>
      {/* Opciones del menú desplegable */}
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleSelectC('Todas los Categorias')}>Todas los Categorias</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSelectC('Small')}>Small</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSelectC('Medium')}>Medium</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSelectC('Large')}>Large</DropdownMenuItem> 
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
 
