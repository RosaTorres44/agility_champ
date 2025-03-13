"use client"

import { useEffect, useState } from "react"
import { Filtros } from './filtros';

interface Competition {
  id: number;
  title: string;
  date: string;
  escuela: string;
  status: string;
}

interface Track {
  id: number;
  name: string;
  grado: string;
  categoria: string;
  obstacles: number;
  velocidadMax: number;
  velocidadMin: number;
  juez: string;
}

interface CompetitionsProps {
  filter?: "active" | "all";
}

export function Competitions({ filter = "all" }: CompetitionsProps) {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [selectedCompetition, setSelectedCompetition] = useState<number | null>(null)
  const [tracks, setTracks] = useState<Track[]>([])
  const [loadingTracks, setLoadingTracks] = useState(false)
  const [gradoFilter, setGradoFilter] = useState<string | null>(null);
  const [categoriaFilter, setCategoriaFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const response = await fetch("/api/competencias")
        if (!response.ok) throw new Error("Error fetching competitions")
        const data = await response.json()

        console.log("API Response:", data)

        const formattedData = Array.isArray(data) ? data.map((item) => ({
          id: item.id_competencia, 
          title: item.des_competencia,
          date: new Date(item.fec_inicio).toLocaleDateString("en-US"),
          escuela: item.Escuela,
          status: item.flg_activo === 1 ? "En Curso" :
                  item.flg_activo === -1 ? "Cerrada" :
                  "Próxima"
        })) : [];

        const filteredCompetitions = filter === "active"
          ? formattedData.filter(comp => comp.status === "Próxima" || comp.status === "En Curso")
          : formattedData;

        setCompetitions(filteredCompetitions)
      } catch (error) {
        console.error("Error fetching competitions:", error)
      }
    }

    fetchCompetitions()
  }, [filter])

  const fetchTracks = async (competitionId: number) => {
    if (filter === "active") return; // 🚀 Si el filtro es "active", no cargar pistas

    setLoadingTracks(true)
    try {
      const response = await fetch(`/api/pistas?competencia_id=${competitionId}`)
      if (!response.ok) throw new Error("Error fetching tracks")
      const data = await response.json()

      console.log("Tracks Response:", data)

      setTracks(data.map((track: any) => ({
        id: track.id_pista,
        name: track.des_pista,
        grado: track.grado,
        categoria: track.categoria,
        obstacles: track.obstaculos,
        velocidadMax: track.velocidad_max,
        velocidadMin: track.velocidad_min,
        juez: track.juez
      })))
    } catch (error) {
      console.error("Error fetching tracks:", error)
      setTracks([])
    } finally {
      setLoadingTracks(false)
    }
  }

  // Manejar la selección de competencia y mostrar las pistas dinámicamente solo si el filtro es "all"
  const handleCompetitionClick = (competitionId: number) => {
    if (filter === "all") {
      if (selectedCompetition === competitionId) {
        setSelectedCompetition(null)
        setTracks([])
      } else {
        setSelectedCompetition(competitionId)
        if (filter === "all") {
          fetchTracks(competitionId)
        }
      }
    }

    
  }

  return (
    <section className="py-12 px-6 bg-gray-50 sm:px-12">
      <h2 className="text-2xl font-bold text-center mb-8">
        {filter === "active" ? "Competencias Activas" : "Todas las Competencias"}
      </h2>

      <div className="flex flex-wrap justify-center gap-6">
        {competitions.length > 0 ? (
          competitions.map((competition) => (
            <div 
              key={competition.id} 
              className={`p-6 bg-white rounded-lg shadow-sm w-80 cursor-pointer ${
                selectedCompetition === competition.id ? "border-2 border-blue-500" : ""
              }`}
              onClick={() => handleCompetitionClick(competition.id)}
            >
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
          ))
        ) : (
          <p className="text-center text-gray-500">
            No hay competencias disponibles en este momento.
          </p>
        )}
      </div>

      {/* 🔹 Mostrar lista de pistas debajo de la competencia seleccionada SOLO SI filter === "all" */}
      {filter === "all" && selectedCompetition && (
        <div className="mt-10 p-6 bg-white rounded-lg shadow-md w-full max-w-4xl mx-auto">

          <h3 className="text-xl font-bold text-center mb-6">Pistas de la competencia seleccionada</h3>
          
          <Filtros 
            gradoFilter={gradoFilter} 
            setGradoFilter={setGradoFilter} 
            categoriaFilter={categoriaFilter} 
            setCategoriaFilter={setCategoriaFilter} 
          />
          
          {loadingTracks ? (
            <p className="text-center text-gray-500">Cargando pistas...</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-6">
              {tracks.length > 0 ? (
                tracks.map(track => (

                  <div key={track.id} className="p-4 bg-gray-100 rounded-lg shadow-sm w-72">
                    <h4 className="font-semibold text-lg mb-2">{track.name}</h4>
                    <p className="text-sm text-muted-foreground">Grado: {track.grado}</p>
                    <p className="text-sm text-muted-foreground">Categoría: {track.categoria}</p>
                    <p className="text-sm text-muted-foreground">Obstáculos: {track.obstacles}</p>
                    <p className="text-sm text-muted-foreground">Velocidad Máx: {track.velocidadMax} m/s</p>
                    <p className="text-sm text-muted-foreground">Velocidad Mín: {track.velocidadMin} m/s</p>
                    <p className="text-sm text-muted-foreground">Juez: {track.juez}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No hay pistas disponibles.</p>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
