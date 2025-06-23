// components/AdminMaestroTabla.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";

interface TableProps {
  entityType: string;
  entities: any[];
  onEdit: (entity: any) => void;
}

const COLUMNS: Record<string, string[]> = {
  perros: ["Nombre", "Fecha Nacimiento", "Sexo", "Chip", "Raza"], 
  personas: ["Nombre", "Apellidos", "Fecha Nacimiento", "Sexo", "Correo", "Rol"],
  competencias: ["Nombre", "Escuela", "Inicio", "Fin"],
  pistas: [
    "Descripción", "Competencia", "Grado", "Categoría", "Juez",
    "Obstáculos", "Longitud", "Velocidad Máx", "Velocidad Mín",
    "Tiempo Máx", "Tiempo Mín", "Tipo",
  ],
};

const formatFecha = (fechaISO: string) => {
  const fecha = new Date(fechaISO);
  return isNaN(fecha.getTime())
    ? "Fecha inválida"
    : fecha.toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
};

const renderCells = (entityKey: string, entity: any) => {
  switch (entityKey) {
    case "perros":
      return [
        entity.Nombre,
        formatFecha(entity.fec_nacimiento),
        String(entity.sexo) === "1" ? "Macho" : "Hembra",
        entity.chip,
        entity.raza,
      ];
    case "usuarios":
    case "personas":
      return [
        entity.Nombre,
        entity.Apellidos,
        formatFecha(entity.fec_nacimiento),
        entity.flg_sexo === 1 ? "Hombre" : "Mujer",
        entity.email,
        entity.role,
      ];
    case "competencias":
      return [
        entity.Nombre,
        entity.escuela,
        formatFecha(entity.fec_inicio),
        formatFecha(entity.fec_fin),
      ];
    case "pistas":
      return [
        entity.Nombre,
        entity.competencia,
        entity.grado,
        entity.categoria,
        entity.juez,
        entity.num_obstaculos,
        entity.num_longitud,
        entity.num_velocidad_maxima,
        entity.num_velocidad_minima,
        entity.num_tiempo_maximo,
        entity.num_tiempo_minimo,
        entity.des_tipo,
      ];
    default:
      return [entity.name];
  }
};

export function AdminMaestroTabla({ entityType, entities, onEdit }: TableProps) {
  const entityKey = entityType.toLowerCase();
  const columns = COLUMNS[entityKey] || ["Nombre"];

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#F9FAFB]">
            <TableHead className="w-[50px] font-medium">Activo</TableHead>
            {columns.map((col, index) => (
              <TableHead key={index} className="font-medium">
                {col}
              </TableHead>
            ))}
            <TableHead className="w-[80px] font-medium">Actualizar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entities.length > 0 ? (
            entities.map((entity) => (
              <TableRow key={entity.id || entity.id_pista}>
                <TableCell>
                  <Checkbox checked={!!entity.active} className="border-[#D1D5DB]" />
                </TableCell>
                {renderCells(entityKey, entity).map((val, idx) => (
                  <TableCell key={idx}>{val}</TableCell>
                ))}
                <TableCell>
                  <Button
                    className="bg-[#6366F1] hover:bg-[#4F46E5]"
                    onClick={() => onEdit(entity)}
                  >
                    <PencilIcon className="w-4 h-4 text-white" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length + 2} className="text-center text-gray-500 py-4">
                No hay registros en {entityType}.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
