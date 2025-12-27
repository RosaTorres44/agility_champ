"use client";

import { useEffect, useState } from "react";
import { Pistas } from "./pistas";

interface Competition {
  id: number;
  title: string;
  date: string;
  escuela: string;
  status: string;
}

interface CompetitionsProps {
  filter?: "active" | "all";
}

export function Competitions({ filter = "all" }: CompetitionsProps) {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState<number | null>(null);
  const [filtersResetKey, setFiltersResetKey] = useState(0); // 🔹 Clave para refrescar filtros

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const response = await fetch("/api/competencias");
        if (!response.ok) throw new Error("Error fetching competitions");
        const data = await response.json();

        const formattedData = data.map((item: any) => ({
          id: item.id_competencia,
          title: item.nombre,
          date: new Date(item.fec_inicio).toLocaleDateString("en-US"),
          escuela: item.Escuela,
          status: item.flg_activo === 1 ? "En Curso" :
                  item.flg_activo === -1 ? "Cerrada" :
                  "Próxima"
        }));

        setCompetitions(filter === "active"
          ? formattedData.filter((competencia: Competition) => competencia.status === "Próxima" || competencia.status === "En Curso")
          : formattedData);
      } catch (error) {
        console.error("Error fetching competitions:", error);
      }
    };

    fetchCompetitions();
  }, [filter]);

  // 🔹 Manejar selección en un solo clic y refrescar filtros
  const handleCompetitionClick = (competitionId: number) => {
    if (filter === "all") {
      setSelectedCompetition(prevId => (prevId === competitionId ? null : competitionId));
      setFiltersResetKey(prevKey => prevKey + 1); // 🔹 Generar una nueva clave para forzar re-render
    }
  };

  return (
    <section className="py-12 px-6 bg-gray-50 sm:px-12">
      <h2 className="text-2xl font-bold text-center mb-8">
        {filter === "active" ? "Competencias Activas" : "Todas las Competencias"}
      </h2>

      <div className="flex flex-wrap justify-center gap-6">
        {competitions.length > 0 ? (
          competitions.map(({ id, title, date, escuela, status }) => (
            <div 
              key={id} 
              className={`p-6 bg-white rounded-lg shadow-sm w-80 cursor-pointer ${
                selectedCompetition === id ? "border-2 border-blue-500" : ""
              }`}
              onClick={() => handleCompetitionClick(id)}
            >
              <h3 className="font-semibold text-lg mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">Fecha: {date}</p>
              <p className="text-sm text-muted-foreground">Escuela: {escuela}</p>
              <p className={`text-sm font-semibold ${
                status === "En Curso" ? "text-green-500" :
                status === "Cerrada" ? "text-gray-500" :
                "text-yellow-500"
              }`}>
                Estado: {status}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No hay competencias disponibles en este momento.
          </p>
        )}
      </div>

      {/* 🔹 Cargar pistas y resetear filtros en un solo clic */}
      {filter === "all" && selectedCompetition !== null && (
        <Pistas key={filtersResetKey} competitionId={selectedCompetition} />
      )}
    </section>
  );
}
