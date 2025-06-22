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

export function AdminMaestroTabla({ entityType, entities, onEdit }: TableProps) {
  const entityKey = entityType.toLowerCase();

  const columns = (() => {
    switch (entityKey) {
      case "perros":
        return ["Nombre", "Fecha Nacimiento", "Sexo", "Chip", "Raza"];
      case "usuarios":
      case "personas":
        return ["Nombre", "Apellidos", "Fecha Nacimiento", "sexo", "Correo", "Rol"];
      case "competencias":
        return ["Nombre", "Escuela", "Inicio", "Fin"];
      default:
        return ["Nombre"];
    }
  })();

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
              <TableRow key={entity.id}>
                <TableCell>
                  <Checkbox checked={!!entity.active} className="border-[#D1D5DB]" />
                </TableCell>

                {entityKey === "perros" ? (
                  <>
                    <TableCell>{entity.Name}</TableCell>
                    <TableCell>{formatFecha(entity.fecha_nacimiento)}</TableCell>
                    <TableCell>{entity.sexo}</TableCell>
                    <TableCell>{entity.chip}</TableCell>
                    <TableCell>{entity.raza}</TableCell>
                  </>
                ) : entityKey === "usuarios" || entityKey === "personas" ? (
                  <>
                    <TableCell>{entity.Nombre}</TableCell>
                    <TableCell>{entity.Apellidos}</TableCell>
                    <TableCell>{formatFecha(entity.fec_nacimiento)}</TableCell>
                    <TableCell>{entity.flg_sexo}</TableCell>
                    <TableCell>{entity.email}</TableCell>
                    <TableCell>{entity.role}</TableCell>
                  </>
                ) : entityKey === "competencias" ? (
                  <>
                    <TableCell>{entity.name}</TableCell>
                    <TableCell>{entity.escuela}</TableCell>
                    <TableCell>{formatFecha(entity.fec_inicio)}</TableCell>
                    <TableCell>{formatFecha(entity.fec_fin)}</TableCell>
                  </>
                ) : (
                  <TableCell>{entity.name}</TableCell>
                )}

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
