"use client"

import { useEffect, useState } from "react";
import { Filtros } from "./filtros";

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

interface PistasProps {
  competitionId: number | null;
  filter?: "active" | "all";
}

export function Pistas({ competitionId, filter }: PistasProps) {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loadingTracks, setLoadingTracks] = useState(false);
  const [gradoFilter, setGradoFilter] = useState<string | null>(null);
  const [categoriaFilter, setCategoriaFilter] = useState<string | null>(null);
  const [pistaFilter, setPistaFilter] = useState<string | null>(null);

  useEffect(() => {
    if (!competitionId) return;

    const fetchTracks = async () => {
      setLoadingTracks(true);
      try {
        const response = await fetch(`/api/pistas?competencia_id=${competitionId}`);
        if (!response.ok) throw new Error("Error fetching tracks");
        const data = await response.json();

        setTracks(data.map((track: any) => ({
          id: track.id_pista,
          name: track.des_pista,
          grado: track.grado,
          categoria: track.categoria,
          obstacles: track.obstaculos,
          velocidadMax: track.velocidad_max,
          velocidadMin: track.velocidad_min,
          juez: track.juez
        })));
      } catch (error) {
        console.error("Error fetching tracks:", error);
        setTracks([]);
      } finally {
        setLoadingTracks(false);
      }
    };

    fetchTracks();
  }, [competitionId]);

  return (
    <div className="mt-20 p-6 bg-white rounded-lg shadow-md w-full max-w-4xl mx-auto">
      <h3 className="text-xl font-bold text-center mb-6">Pistas de la competencia seleccionada</h3>
      
      <Filtros 
        gradoFilter={gradoFilter} 
        setGradoFilter={setGradoFilter} 
        categoriaFilter={categoriaFilter} 
        setCategoriaFilter={setCategoriaFilter} 
        pistaFilter={pistaFilter} 
        setPistaFilter={setPistaFilter} 
        filter={filter}
        competitionId={competitionId}
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
  );
}
