"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";

interface TablaResultadosProps {
  guia: string | null;
  perro: string | null;
  competencia: string | null;
  pista: string | null;
}

export function TablaResultados({ guia, perro, competencia, pista }: TablaResultadosProps) {
  const [rankings, setRankings] = useState<any[]>([]);
  const [filteredRankings, setFilteredRankings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Cargar resultados desde la API
  useEffect(() => {
    async function fetchRankings() {
      try {
        setLoading(true);

        const response = await fetch("/api/resultados");
        if (!response.ok) {
          throw new Error("Error al obtener los rankings");
        }

        const data = await response.json();

        // 🔹 Mapeamos los datos para asegurar consistencia con la tabla
        const formattedData = data.map((item: any) => ({
          competitionName: item.competitionName,
          dogName: item.dogName,
          handlerName: item.handlerName,
          grado: item.grado,
          categoria: item.categoria,
          pista: item.pista,
          rating: item.rating,
          speed: item.speed,
          faltas: item.faltas,
          rehuses: item.rehuses,
          num_penalizacion_recorrido: item.num_penalizacion_recorrido,
          num_penalizacion_tiempo: item.num_penalizacion_tiempo,
          num_total_penalizaciones: item.num_total_penalizaciones,
        }));

        setRankings(formattedData);
        setFilteredRankings(formattedData);
      } catch (err) {
        setError("Error al obtener los rankings");
      } finally {
        setLoading(false);
      }
    }

    fetchRankings();
  }, []);

  // 🔍 Filtrar resultados según los filtros seleccionados
  useEffect(() => {
    if (!rankings.length) return;

    const filtered = rankings.filter((ranking) => {
      const matchesGuia = !guia || ranking.handlerName === guia;
      const matchesPerro = !perro || ranking.dogName === perro;
      const matchesCompetencia = !competencia || ranking.competitionName === competencia;
      const matchesPista = !pista || ranking.pista === pista;
      return matchesGuia && matchesPerro && matchesCompetencia && matchesPista;
    });

    setFilteredRankings(filtered);
  }, [guia, perro, competencia, pista, rankings]);

  if (loading) {
    return <div className="p-4">Cargando resultados...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
      <table className="w-full">
        <thead>
            <tr className="border-b bg-gray-100">
            <th className="text-left p-4">Nombre Guía</th>
            <th className="text-left p-4">Nombre Perro</th>
            <th className="text-left p-4">Competencia</th>
            <th className="text-left p-4">Pista</th>
            <th className="text-left p-4">Grado</th>
            <th className="text-left p-4">Categoría</th>
            <th className="text-left p-4">Ranking</th>
            <th className="text-left p-4">Velocidad</th>
            <th className="text-left p-4">Faltas</th>
            <th className="text-left p-4">Rehuses</th>
            <th className="text-left p-4">Penalizacion Recorrido</th>
            <th className="text-left p-4">Penalizacion Tiempo</th>
            <th className="text-left p-4">Penalizacion Total</th>
          </tr>
        </thead>
        <tbody>
          {filteredRankings.length > 0 ? (
            filteredRankings.map((ranking, index) => (
              <tr key={index} className="border-b">
                <td className="p-4">{ranking.handlerName}</td>
                <td className="p-4">{ranking.dogName}</td>
                <td className="p-4">{ranking.competitionName}</td>
                <td className="p-4">{ranking.pista}</td>
                <td className="p-4">{ranking.grado}</td>
                <td className="p-4">{ranking.categoria}</td>
                <td className="p-4 flex items-center gap-2">
                  {ranking.rating}
                  {ranking.rating === 1 && <Star className="text-yellow-500" />}
                  {ranking.rating === 2 && <Star className="text-gray-500" />}
                  {ranking.rating === 3 && <Star className="text-orange-500" />}
                </td>
                <td className="p-4">{ranking.speed}</td>
                <td className="p-4">{ranking.faltas}</td>
                <td className="p-4">{ranking.rehuses}</td>
                <td className="p-4">{ranking.num_penalizacion_recorrido}</td>
                <td className="p-4">{ranking.num_penalizacion_tiempo}</td>
                <td className="p-4">{ranking.num_total_penalizaciones}</td> 



                
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="p-4 text-center text-gray-500">No hay resultados para estos filtros</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
