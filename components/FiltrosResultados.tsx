import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface FiltrosResultadosProps {
  guias: string[];
  perros: string[];
  competencias: { id: number; nombre: string }[];
  pistas: { id: number; nombre: string }[];

  selectedGuia: string;
  setSelectedGuia: (value: string) => void;
  selectedPerro: string;
  setSelectedPerro: (value: string) => void;
  selectedCompetencia: { id: number; nombre: string };
  setSelectedCompetencia: (value: { id: number; nombre: string }) => void;
  selectedPista: string;
  setSelectedPista: (value: string) => void;
}

export function FiltrosResultados({
  guias, perros, competencias, pistas,
  selectedGuia, setSelectedGuia,
  selectedPerro, setSelectedPerro,
  selectedCompetencia, setSelectedCompetencia,
  selectedPista, setSelectedPista
}: FiltrosResultadosProps) {
  return (
    <div className="flex flex-row flex-wrap gap-4 w-full overflow-x-auto">
      <FiltroDropdown label="Guía" opciones={guias} selected={selectedGuia} setSelected={setSelectedGuia} />
      {selectedGuia !== "Guía" && <FiltroDropdown label="Perro" opciones={perros} selected={selectedPerro} setSelected={setSelectedPerro} />}
      {selectedPerro !== "Perro" && (
        <FiltroDropdown
          label="Competencia"
          opciones={competencias.map((c) => c.nombre)}
          selected={selectedCompetencia.nombre}
          setSelected={(nombre) => {
            const compSeleccionada = competencias.find((c) => c.nombre === nombre) || { id: 0, nombre: "Competencia" };
            setSelectedCompetencia(compSeleccionada);
          }}
        />
      )}
      {selectedCompetencia.id !== 0 && <FiltroDropdown label="Pista" opciones={pistas.map((p) => p.nombre)} selected={selectedPista} setSelected={setSelectedPista} />}
    </div>
  );
}

function FiltroDropdown({ label, opciones, selected, setSelected }: { label: string; opciones: string[]; selected: string; setSelected: (value: string) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={`w-[200px] h-[45px] text-center truncate ${selected === label ? "font-bold" : ""}`}>
          {selected}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        {opciones.map((opcion) => (
          <DropdownMenuItem key={opcion} onClick={() => setSelected(opcion)}>{opcion}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
