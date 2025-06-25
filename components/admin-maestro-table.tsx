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
import { PencilIcon } from "lucide-react"; // 🔹 Asegurar que sea el nombre correcto

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
  entities: any[]; // 🔹 Permitir cualquier tipo de entidad temporalmente
  onEdit: (entity: any) => void; // 🔹 Evita errores de tipado en `dispatch`
}



export function AdminMaestroTabla({ entityType, entities, onEdit }: TableProps) {
  // 🔹 Definir columnas dinámicas según el tipo de entidad
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
            entities.map((entity) => (
              <TableRow key={entity.id}>
                <TableCell>
                  <Checkbox checked={entity.flg_activo} className="border-[#D1D5DB]" />
                </TableCell>

                {/* 🔹 Render dinámico de columnas */}
                {entityType.toLowerCase() === "personas" && (
                  <>
                    <TableCell>{(entity as Persona).nombre}</TableCell>
                    <TableCell>{(entity as Persona).apellidos}</TableCell>
                    <TableCell>{(entity as Persona).fec_nacimiento}</TableCell>
                    <TableCell>{(entity as Persona).role}</TableCell>
                  </>
                )}

                {entityType.toLowerCase() === "perros" && (
                  <>
                    <TableCell>{(entity as Perro).nombre}</TableCell>
                    <TableCell>{(entity as Perro).raza}</TableCell>
                    <TableCell>{(entity as Perro).fec_nacimiento}</TableCell>
                    <TableCell>{(entity as Perro).chip}</TableCell>
                  </>
                )}

                {entityType.toLowerCase() === "competencias" && (
                  <>
                    <TableCell>{(entity as Competencia).nombre}</TableCell>
                    <TableCell>{(entity as Competencia).escuela}</TableCell>
                    <TableCell>{(entity as Competencia).fec_inicio}</TableCell>
                    <TableCell>{(entity as Competencia).fec_fin}</TableCell> 
                  </>
                )}

                {entityType.toLowerCase() === "dupla" && (
                  <>
                    <TableCell>{(entity as Dupla).idPersona}</TableCell>
                    <TableCell>{(entity as Dupla).idPerro}</TableCell>
                    <TableCell>{(entity as Dupla).idGrado}</TableCell>
                    <TableCell>{(entity as Dupla).idCategoria}</TableCell>
                  </>
                )}

                {/* 🔹 Para entidades simples como categorías, grados , escuelas y razas */}
                {["categorias", "grados", "escuelas", "razas"].includes(entityType.toLowerCase()) && (
                  <TableCell>{(entity as BaseEntidad & { nombre: string }).nombre}</TableCell>
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