"use client"

import { useEffect, useState } from "react";
import { Filtros } from "./filtros";
import { TablaRankingOri } from './tablaranking';

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
  const [filteredTracks, setFilteredTracks] = useState<Track[]>([]);
  const [loadingTracks, setLoadingTracks] = useState(false);
  const [gradoFilter, setGradoFilter] = useState<string | null>("Grados");
  const [categoriaFilter, setCategoriaFilter] = useState<string | null>("Categorías");
  const [pistaFilter, setPistaFilter] = useState<string | null>("Pistas");
  const [selectedPista, setSelectedPista] = useState<string | null>(null); // 🔹 Estado para la pista seleccionada

  useEffect(() => {
    if (!competitionId) return;

    const fetchTracks = async () => {
      setLoadingTracks(true);
      try {
        const response = await fetch(`/api/pistas?competencia_id=${competitionId}`);
        if (!response.ok) throw new Error("Error fetching tracks");
        const data = await response.json();

        const formattedTracks = data.map((track: any) => ({
          id: track.id_pista,
          name: track.Nombre,
          grado: track.grado,
          categoria: track.categoria,
          obstacles: track.obstaculos,
          velocidadMax: track.velocidad_max,
          velocidadMin: track.velocidad_min,
          juez: track.juez
        }));

        setTracks(formattedTracks);
        setFilteredTracks(formattedTracks); // Inicializar con todas las pistas
      } catch (error) {
        console.error("Error fetching tracks:", error);
        setTracks([]);
        setFilteredTracks([]);
      } finally {
        setLoadingTracks(false);
      }
    };

    fetchTracks();
  }, [competitionId]);

  // 🔹 Filtrar las pistas cuando cambian los filtros
  useEffect(() => {
    // Cuando los filtros cambian, ocultar el ranking
    setSelectedPista(null);

    if (
      (gradoFilter === "Grados" || gradoFilter === null) &&
      (categoriaFilter === "Categorías" || categoriaFilter === null) &&
      (pistaFilter === "Pistas" || pistaFilter === null)
    ) {
      setFilteredTracks(tracks); // Si no hay filtros, mostrar todas las pistas
    } else {
      const filtered = tracks.filter(track =>
        (gradoFilter === "Grados" || track.grado === gradoFilter) &&
        (categoriaFilter === "Categorías" || track.categoria === categoriaFilter) &&
        (pistaFilter === "Pistas" || track.name === pistaFilter)
      );
      setFilteredTracks(filtered);
    }
  }, [gradoFilter, categoriaFilter, pistaFilter, tracks]);

  // 🔹 Manejar el click en una pista para actualizar `selectedPista`
  const handlePistaClick = (pistaName: string) => {
    setSelectedPista(prev => (prev === pistaName ? null : pistaName));
  };

  return (
    <div className="mt-10 p-5 bg-white rounded-lg shadow-md w-full max-w-6xl mx-auto">
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
          {filteredTracks.length > 0 ? (
            filteredTracks.map(track => (
              <div 
                key={track.id} 
                className={`p-4 bg-gray-100 rounded-lg shadow-sm w-72 cursor-pointer ${
                  selectedPista === track.name ? "border-2 border-blue-500" : ""
                }`}
                onClick={() => handlePistaClick(track.name)} // 🔹 Click en pista
              >
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

      {/* 🔹 Mostrar ranking solo si hay una pista seleccionada */}
      {selectedPista && (
        <TablaRankingOri 
          gradoFilter={gradoFilter} 
          categoriaFilter={categoriaFilter} 
          pistaFilter={selectedPista} // 🔹 Se pasa la pista seleccionada
          filter={filter} 
        />
      )}
    </div>
  );
}
