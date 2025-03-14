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
import { Pencil } from "lucide-react"; // 🔹 Se usa un ícono de actualización

interface Entidad {
  id: number;
  name: string;
  active: boolean;
}

interface TableProps {
  entityType: string; // ✅ Se pasa el tipo de entidad
  entities: Entidad[];
  onEdit: (entity: Entidad) => void;
}

export function AdminMaestroTabla({ entityType, entities, onEdit }: TableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#F9FAFB]">
            <TableHead className="w-[50px] font-medium">Activo</TableHead>
            <TableHead className="font-medium">{entityType}</TableHead> {/* ✅ Dinámico */}
            <TableHead className="w-[80px] font-medium">Actualizar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entities.length > 0 ? (
            entities.map((entity) => (
              <TableRow key={entity.id}>
                <TableCell>
                  <Checkbox checked={entity.active} className="border-[#D1D5DB]" />
                </TableCell>
                <TableCell>{entity.name}</TableCell>
                <TableCell>
                  <Button
                    className="bg-[#6366F1] hover:bg-[#4F46E5]"
                    onClick={() => onEdit(entity)}
                  >
                    <Pencil className="w-4 h-4 text-white" /> {/* 🔹 Ícono de editar */}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-gray-500 py-4">
                No hay registros en {entityType}.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
