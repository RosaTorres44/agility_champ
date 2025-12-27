"use client";
import { Filtros } from './filtros';
import { TablaRankingOri } from './tablaranking';
import { useState } from 'react';

interface CompetitionsProps {
  filter?: "active" | "all";
}

export function Rankings({ filter }: CompetitionsProps)  {
  const [gradoFilter, setGradoFilter] = useState<string | null>(null);
  const [categoriaFilter, setCategoriaFilter] = useState<string | null>(null); 

  return (
    <section className="py-12 px-6 sm:px-12">
      <h2 className="text-2xl font-bold text-center">Rankings</h2>
      <p className="text-center text-muted-foreground mt-2">
        Revisa los rankings de la última competencia
      </p>
      <Filtros 
        gradoFilter={gradoFilter} 
        setGradoFilter={setGradoFilter} 
        categoriaFilter={categoriaFilter} 
        setCategoriaFilter={setCategoriaFilter}  
      />
      <TablaRankingOri gradoFilter={gradoFilter} categoriaFilter={categoriaFilter}  filter={filter} />
    </section>
  );
}
