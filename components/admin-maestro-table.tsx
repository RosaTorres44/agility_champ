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

interface BaseEntidad {
  id: number;
  flg_activo: boolean;
}

interface Persona extends BaseEntidad {
  nombre: string;
  apellidos: string;
  fec_nacimiento: string;
  role: string;
}

interface Perro extends BaseEntidad {
  nombre: string;
  raza: string;
  fec_nacimiento: string;
  chip: number;
}

interface Competencia extends BaseEntidad {
  nombre: string;
  escuela: string;
  fec_inicio: string;
  fec_fin: string;
}

interface Dupla extends BaseEntidad {
  idPersona: number;
  idPerro: number;
  idGrado: number;
  idCategoria: number;
}

type Entidad = BaseEntidad | Persona | Perro | Dupla;

interface TableProps {
  entityType: string;
  entities: any[];
  onEdit: (entity: any) => void;
}

export function AdminMaestroTabla({ entityType, entities, onEdit }: TableProps) {
  const columns = (() => {
    switch (entityType.toLowerCase()) {
      case "personas":
        return ["Nombres", "Apellidos", "F. Nacimiento", "Rol"];
      case "perros":
        return ["Nombre", "Raza", "F. Nacimiento", "Chip"];
      case "competencias":
        return ["Nombre", "Escuela", "F. Inicio", "F. Fin"];
      case "duplas":
        return ["ID Persona", "ID Perro", "ID Grado", "ID Categoría"];
      default:
        return ["Nombre"];
    }
  })();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-[#F9FAFB]">
            <TableHead className="w-[50px] font-medium">Activo</TableHead>
            {columns.map((col, index) => (
              <TableHead key={index} className="font-medium">{col}</TableHead>
            ))}
            <TableHead className="w-[80px] font-medium">Actualizar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entities.length > 0 ? (
            entities.map((entity) => {
              const lowerEntity = entityType.toLowerCase();

              // 🔧 Transformar claves para que el form herede bien
              const transformedEntity =
                lowerEntity === "personas"
                  ? {
                      ...entity,
                      apellido: entity.apellidos,
                      rol: entity.role,
                      sexo: String(entity.flg_sexo), // ✅ corregido según nombre real
                      fec_nacimiento: entity.fec_nacimiento?.slice(0, 10), // ✅ formato YYYY-MM-DD
                    }
                  : entity;


              return (
                <TableRow key={entity.id}>
                  <TableCell>
                    <Checkbox checked={entity.flg_activo} className="border-[#D1D5DB]" />
                  </TableCell>

                  {lowerEntity === "personas" && (
                    <>
                      <TableCell>{entity.nombre}</TableCell>
                      <TableCell>{entity.apellidos}</TableCell>
                      <TableCell>{entity.fec_nacimiento}</TableCell>
                      <TableCell>{entity.role}</TableCell>
                    </>
                  )}

                  {lowerEntity === "perros" && (
                    <>
                      <TableCell>{entity.nombre}</TableCell>
                      <TableCell>{entity.raza}</TableCell>
                      <TableCell>{entity.fec_nacimiento}</TableCell>
                      <TableCell>{entity.chip}</TableCell>
                    </>
                  )}

                  {lowerEntity === "competencias" && (
                    <>
                      <TableCell>{entity.nombre}</TableCell>
                      <TableCell>{entity.escuela}</TableCell>
                      <TableCell>{entity.fec_inicio}</TableCell>
                      <TableCell>{entity.fec_fin}</TableCell>
                    </>
                  )}

                  {lowerEntity === "duplas" && (
                    <>
                      <TableCell>{entity.idPersona}</TableCell>
                      <TableCell>{entity.idPerro}</TableCell>
                      <TableCell>{entity.idGrado}</TableCell>
                      <TableCell>{entity.idCategoria}</TableCell>
                    </>
                  )}

                  {["categorias", "grados", "escuelas", "razas"].includes(lowerEntity) && (
                    <TableCell>{entity.nombre}</TableCell>
                  )}

                  <TableCell>
                    <Button
                      className="bg-[#6366F1] hover:bg-[#4F46E5]"
                      onClick={() => onEdit(transformedEntity)}
                    >
                      <PencilIcon className="w-4 h-4 text-white" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
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
