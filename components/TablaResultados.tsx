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

  // Simulación de datos de una API
  useEffect(() => {
    async function fetchRankings() {
      try {
        setLoading(true);

        // 🔹 Datos de ejemplo (reemplazar con API real si es necesario)
        const data = [
          { competitionName: "Open Speed Runners", dogName: "Zoé", handlerName: "Rosita", grado: "Grado 1", categoria: "Pequeños", pista: "Pista Técnica", ranking: 1 },
          { competitionName: "Open Speed Runners", dogName: "Hanna", handlerName: "Rosita", grado: "Grado 2", categoria: "Medianos", pista: "Pista Técnica", ranking: 3 },
          { competitionName: "Agility Championship", dogName: "Maya", handlerName: "Mario", grado: "Grado 2", categoria: "Grandes", pista: "Pista Rápida", ranking: 2 },
          { competitionName: "Agility Championship", dogName: "Bruno", handlerName: "Laura", grado: "Grado 3", categoria: "Medianos", pista: "Pista Técnica", ranking: 1 }
        ];

        setRankings(data);
        setFilteredRankings(data); // Inicializa con todos los resultados

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
            <th className="text-left p-4">Competencia</th>
            <th className="text-left p-4">Nombre Perro</th>
            <th className="text-left p-4">Nombre Guía</th>
            <th className="text-left p-4">Grado</th>
            <th className="text-left p-4">Categoría</th>
            <th className="text-left p-4">Pista</th>
            <th className="text-left p-4">Ranking</th>
          </tr>
        </thead>
        <tbody>
          {filteredRankings.length > 0 ? (
            filteredRankings.map((ranking, index) => (
              <tr key={index} className="border-b">
                <td className="p-4">{ranking.competitionName}</td>
                <td className="p-4">{ranking.dogName}</td>
                <td className="p-4">{ranking.handlerName}</td>
                <td className="p-4">{ranking.grado}</td>
                <td className="p-4">{ranking.categoria}</td>
                <td className="p-4">{ranking.pista}</td>
                <td className="p-4 flex items-center gap-2">
                  {ranking.ranking}
                  {ranking.ranking === 1 && <Star className="text-yellow-500" />}
                  {ranking.ranking === 2 && <Star className="text-gray-500" />}
                  {ranking.ranking === 3 && <Star className="text-orange-500" />}
                </td>
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
