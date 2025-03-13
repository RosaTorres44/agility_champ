"use client"

import { useEffect, useState } from "react"

export function Total_Competitions() {
  interface Competition {
    title: string;
    date: string;
    escuela: string;
    status: string;
  }

  const [competitions, setCompetitions] = useState<Competition[]>([])

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const response = await fetch("/api/competencias")
        if (!response.ok) throw new Error("Error fetching competitions")
        const data = await response.json()

        console.log("API Response:", data) // 🔍 Depuración

        const formattedData = Array.isArray(data) ? data.map((item) => {
          const startDate = new Date(item.fec_inicio); 
          const flg_activo = item.flg_activo; 

            let status = "Pendiente";
            switch (flg_activo) {
            case 1:
              status = "En Curso";
              break;
            case -1:
              status = "Cerrada";
              break;
            case 0:
              status = "Próxima";
              break;
            }

          return {
            title: item.des_competencia,
            date: startDate.toLocaleDateString("en-US"),
            escuela: item.Escuela,
            status
          };
        }) : [];

        setCompetitions(formattedData)
      } catch (error) {
        console.error("Error fetching competitions:", error)
      }
    }

    fetchCompetitions()
  }, [])

  return (
    <section className="py-12 px-6 bg-gray-50 sm:px-12">
      <h2 className="text-2xl font-bold text-center mb-8">Competencias</h2>

      <div className="flex flex-wrap justify-center gap-6">
  {competitions.map((competition, index) => (
    <div key={index} className="p-6 bg-white rounded-lg shadow-sm w-80">
      <h3 className="font-semibold text-lg mb-2">{competition.title}</h3>
      <p className="text-sm text-muted-foreground">Fecha: {competition.date}</p>
      <p className="text-sm text-muted-foreground">Escuela: {competition.escuela}</p>
      <p className={`text-sm font-semibold ${
        competition.status === "En Curso" ? "text-green-500" :
        competition.status === "Cerrada" ? "text-gray-500" :
        "text-yellow-500"
      }`}>
        Estado: {competition.status}
      </p>
    </div>
  ))}
</div>

    </section>
  )
}
