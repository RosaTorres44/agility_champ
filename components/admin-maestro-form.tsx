"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { renderCampo, renderSelect, renderSwitch } from "@/components/form-fields";
import { sexoOptions, roleOptions } from "@/lib/form-config";

const esquemaGenerico = z.object({
  nombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  flg_activo: z.boolean(),
});

const esquemaPersona = z.object({
  nombre: z.string().min(2),
  Apellidos: z.string().min(2),
  flg_sexo: z.union([z.literal("0"), z.literal("1")]),
  fec_nacimiento: z.string(),
  role: z.string(),
  flg_activo: z.boolean(),
});

const esquemaPerro = z.object({
  nombre: z.string().min(2),
  fec_nacimiento: z.string(),
  sexo: z.union([z.literal("0"), z.literal("1")]),
  chip: z.string(),
  id_raza: z.string(),
  flg_activo: z.boolean(),
});

const esquemaCompetencia = z.object({
  nombre: z.string().min(2),
  id_escuela: z.string(),
  fec_inicio: z.string(),
  fec_fin: z.string(),
  flg_activo: z.boolean(),
});

interface DynamicFormProps {
  entityType: string;
  reloadData: () => void;
  selectedEntity?: any | null;
  onCancel: () => void;
}

export function DynamicForm({ entityType = "Entidad", reloadData, selectedEntity, onCancel }: DynamicFormProps) {
  const key = entityType.toLowerCase();
  const isPersona = key === "personas";
  const isPerro = key === "perros";
  const isCompetencia = key === "competencias";

  const [razas, setRazas] = useState<{ id: number | string; nombre: string }[]>([]);
  const [razasLoaded, setRazasLoaded] = useState(false);
  const [escuelas, setEscuelas] = useState<{ id: number | string; nombre: string }[]>([]);
  const [escuelasLoaded, setEscuelasLoaded] = useState(false);

  const schema = isPersona
    ? esquemaPersona
    : isPerro
    ? esquemaPerro
    : isCompetencia
    ? esquemaCompetencia
    : esquemaGenerico;

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: isPersona
      ? {
          nombre: "",
          Apellidos: "",
          flg_sexo: "0",
          fec_nacimiento: "",
          role: "Usuario",
          flg_activo: true,
        }
      : isPerro
      ? {
          nombre: "",
          fec_nacimiento: "",
          sexo: "1",
          chip: "",
          id_raza: "",
          flg_activo: true,
        }
      : isCompetencia
      ? {
          nombre: "",
          id_escuela: "",
          fec_inicio: "",
          fec_fin: "",
          flg_activo: true,
        }
      : {
          nombre: "",
          flg_activo: true,
        },
    mode: "onChange",
  });

  useEffect(() => {
    if (isPerro) {
      const cargarRazas = async () => {
        const res = await fetch("/api/razas");
        const data = await res.json();
        const activas = data.filter((r: any) => r.flg_activo === 1);
        setRazas(activas);
        setRazasLoaded(true);
      };
      cargarRazas();
    }
  }, [isPerro]);

  useEffect(() => {
    if (isCompetencia) {
      const cargarEscuelas = async () => {
        const res = await fetch("/api/escuelas");
        const data = await res.json();
        const activas = data.filter((e: any) => e.flg_activo === 1);
        setEscuelas(activas);
        setEscuelasLoaded(true);
      };
      cargarEscuelas();
    }
  }, [isCompetencia]);

  useEffect(() => {
    if (selectedEntity && (!isPerro || razasLoaded) && (!isCompetencia || escuelasLoaded)) {
      form.reset(
        isPersona
          ? {
              nombre: selectedEntity.nombre || "",
              Apellidos: selectedEntity.Apellidos || "",
              flg_sexo: String(selectedEntity.flg_sexo ?? "0"),
              fec_nacimiento: selectedEntity.fec_nacimiento?.slice(0, 10) || "",
              role: selectedEntity.role || "Usuario",
              flg_activo: selectedEntity.flg_activo === 1,
            }
          : isPerro
          ? {
              nombre: selectedEntity.nombre || "",
              fec_nacimiento: selectedEntity.fec_nacimiento?.slice(0, 10) || "",
              sexo: String(selectedEntity.sexo ?? selectedEntity.flg_sexo ?? "1"),
              chip: String(selectedEntity.chip || ""),
              id_raza: String(selectedEntity.id_raza || ""),
              flg_activo: selectedEntity.flg_activo ?? true,
            }
          : isCompetencia
          ? {
              nombre: selectedEntity.nombre || "",
              id_escuela: String(selectedEntity.id_escuela || ""),
              fec_inicio: selectedEntity.fec_inicio?.slice(0, 10) || "",
              fec_fin: selectedEntity.fec_fin?.slice(0, 10) || "",
              flg_activo: selectedEntity.flg_activo ?? true,
            }
          : {
              nombre: selectedEntity.nombre || "",
              flg_activo: selectedEntity.flg_activo ?? true,
            }
      );
    }
  }, [selectedEntity, form, isPersona, isPerro, isCompetencia, razasLoaded, escuelasLoaded]);

  const onSubmit = async (values: any) => {
    try {
      const method = selectedEntity ? "PUT" : "POST";
      let body = selectedEntity ? { id: selectedEntity.id, ...values } : values;

      if (isPersona) {
        body = {
          id: selectedEntity?.id,
          nombre: values.nombre,
          apellidos: values.Apellidos,
          birthdate: values.fec_nacimiento,
          flg_sexo: Number(values.flg_sexo),
          role: values.role,
          flg_activo: values.flg_activo,
        };
      } else if (isPerro) {
        body = {
          id: selectedEntity?.id,
          nombre: values.nombre,
          fec_nacimiento: values.fec_nacimiento,
          sexo: parseInt(values.sexo),
          chip: values.chip,
          id_raza: parseInt(values.id_raza),
          flg_activo: values.flg_activo,
        };
      }

      const url = `/api/${entityType.toLowerCase()}`;
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.error) {
        alert(`❌ Error: ${data.error}`);
      } else {
        alert(selectedEntity ? `✅ ${entityType} actualizada exitosamente` : `✅ ${entityType} agregada exitosamente`);
        reloadData();
        onCancel();
      }
    } catch (error) {
      alert(`❌ Hubo un problema al registrar la ${entityType.toLowerCase()}`);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {isPersona ? (
          <>
            {renderCampo(form, "nombre", "Nombres")}
            {renderCampo(form, "Apellidos", "Apellidos")}
            {renderCampo(form, "fec_nacimiento", "F. Nacimiento", "date")}
            {renderSelect(form, "flg_sexo", "Sexo", sexoOptions)}
            {renderSelect(form, "role", "Rol", roleOptions)}
          </>
        ) : isPerro ? (
          <>
            {renderCampo(form, "nombre", "Nombre del perro")}
            {renderCampo(form, "fec_nacimiento", "Fecha nacimiento", "date")}
            {renderSelect(form, "sexo", "Sexo", sexoOptions)}
            {renderCampo(form, "chip", "Chip")}
            {renderSelect(form, "id_raza", "Raza", razas)}
          </>
        ) : isCompetencia ? (
          <>
            {renderCampo(form, "nombre", "Nombre competencia")}
            {renderSelect(form, "id_escuela", "Escuela", escuelas)}
            {renderCampo(form, "fec_inicio", "Fecha inicio", "date")}
            {renderCampo(form, "fec_fin", "Fecha fin", "date")}
          </>
        ) : (
          renderCampo(form, "nombre", `Nombre de ${entityType}`)
        )}

        {renderSwitch(form, "flg_activo", "Activo")}

        <div className="flex justify-between">
          <Button type="submit" className="bg-[#6366F1] hover:bg-[#4F46E5]">
            {selectedEntity ? `Actualizar ${entityType}` : `Agregar ${entityType}`}
          </Button>
          <Button type="button" className="bg-red-500 hover:bg-red-700" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}