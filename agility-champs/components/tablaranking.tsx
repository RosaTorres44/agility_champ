"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TablaRankingProps {
  gradoFilter: string | null;
  categoriaFilter: string | null;
  competitionId?: number | null; // ID de la competencia seleccionada o null para la última activa
}

export function TablaRankingOri({ gradoFilter, categoriaFilter, competitionId = null }: TablaRankingProps) {
  const [rankings, setRankings] = useState<any[]>([]);
  const [filteredRankings, setFilteredRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRankings() {
      try {
        // 🚀 Construimos la URL según si queremos la última competencia activa o una específica
        const url = competitionId 
          ? `/api/rankings?competencia_id=${competitionId}`
          : `/api/rankings?last_active=1`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Error al obtener los rankings");
        }
        const data = await response.json();
        setRankings(data);
        setFilteredRankings(data); // Inicializa el estado filtrado con todos los datos
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchRankings();
  }, [competitionId]); // 🔹 Se ejecuta al cambiar el ID de la competencia

  // Efecto para filtrar rankings cuando cambian los filtros
  useEffect(() => {
    if (!rankings.length) return;

    const isTodosGrados = !gradoFilter || gradoFilter === "Todos";
    const isTodasCategorias = !categoriaFilter || categoriaFilter === "Todas";

    if (isTodosGrados && isTodasCategorias) {
      // Mostrar todos los registros si ambos filtros están en "Todos"
      setFilteredRankings(rankings);
    } else {
      // Aplicar filtros específicos
      const filtered = rankings.filter((ranking) => {
        const matchesGrado = isTodosGrados || ranking.grado === gradoFilter;
        const matchesCategoria = isTodasCategorias || ranking.categoria === categoriaFilter;
        return matchesGrado && matchesCategoria;
      });

      setFilteredRankings(filtered);
    }
  }, [gradoFilter, categoriaFilter, rankings]);

  if (loading) {
    return <div>Cargando rankings...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4">Nombre Perro</th>
            <th className="text-left p-4">Nombre Guía</th>
            <th className="text-left p-4">Grado</th>
            <th className="text-left p-4">Categoría</th>
            <th className="text-left p-4">Pista</th>
            <th className="text-left p-4">Ranking</th>
            <th className="text-left p-4">Foto</th>
            <th className="text-left p-4">Más detalles</th>
          </tr>
        </thead>
        <tbody>
          {filteredRankings.map((ranking, index) => (
            <tr key={index} className="border-b">
              <td className="p-4">{ranking.dogName}</td>
              <td className="p-4">{ranking.handlerName}</td>
              <td className="p-4">{ranking.grado}</td>
              <td className="p-4">{ranking.categoria}</td>
              <td className="p-4">{ranking.pista}</td>
              <td className="p-4">
                {ranking.rating}
                {ranking.rating === 1 && <Star className="inline-block ml-2 text-yellow-500" />}
                {ranking.rating === 2 && <Star className="inline-block ml-2 text-gray-500" />}
                {ranking.rating === 3 && <Star className="inline-block ml-2 text-orange-500" />}
              </td>
              <td className="p-4">
                <Image
                  src={ranking.image}
                  alt={`${ranking.dogName}'s photo`}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
              </td>
              <td className="p-4">
                <Button 
                  size="sm"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Ver detalles
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
