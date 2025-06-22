"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 🔹 Esquemas
const esquemaEntidad = z.object({
  name: z.string().min(2),
  active: z.boolean(),
});

const esquemaPerro = z.object({
  Name: z.string().min(2),
  fecha_nacimiento: z.string(),
  sexo: z.union([z.literal("0"), z.literal("1")]),
  chip: z.string(),
  id_raza: z.string(),
  active: z.boolean(),
});

const esquemaPersona = z.object({
  name: z.string().min(2),
  lastname: z.string().min(2),
  birthdate: z.string(),
  sexo: z.union([z.literal("0"), z.literal("1")]),
  email: z.string().email(),
  role: z.enum(["Usuario", "Juez"]),
  active: z.boolean(),
});

const esquemaCompetencia = z.object({
  name: z.string().min(2),
  id_escuela: z.string().min(1),
  fec_inicio: z.string(),
  fec_fin: z.string(),
  active: z.boolean(),
});

type PerroForm = z.infer<typeof esquemaPerro>;
type PersonaForm = z.infer<typeof esquemaPersona>;
type CompetenciaForm = z.infer<typeof esquemaCompetencia>;

interface Option {
  id: number;
  name: string;
}

interface DynamicFormProps {
  entityType: string;
  reloadData: () => void;
  selectedEntity?: any;
  onCancel: () => void;
}

export function DynamicForm({
  entityType = "Entidad",
  reloadData,
  selectedEntity,
  onCancel,
}: DynamicFormProps) {
  const key = entityType.toLowerCase();
  const isPerro = key === "perros";
  const isPersona = key === "usuarios" || key === "personas";
  const isCompetencia = key === "competencias";

  const schema = isPerro
    ? esquemaPerro
    : isPersona
    ? esquemaPersona
    : isCompetencia
    ? esquemaCompetencia
    : esquemaEntidad;

  const form = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: isPerro
      ? { Name: "", fecha_nacimiento: "", sexo: "0", chip: "", id_raza: "", active: true }
      : isPersona
      ? {
          name: "",
          lastname: "",
          birthdate: "",
          sexo: "0",
          email: "",
          role: "Usuario",
          active: true,
        }
      : isCompetencia
      ? {
          name: "",
          id_escuela: "",
          fec_inicio: "",
          fec_fin: "",
          active: true,
        }
      : { name: "", active: true },
    mode: "onChange",
  });

  const [opcionesEscuela, setOpcionesEscuela] = useState<Option[]>([]);
  const [opcionesRaza, setOpcionesRaza] = useState<Option[]>([]);

  // 🔹 Cargar escuelas o razas activas
  useEffect(() => {
    if (isCompetencia) {
      fetch("/api/escuelas")
        .then((res) => res.json())
        .then((data) => {
          const activos = data.filter((e: any) => e.active === 1 || e.active === true);
          setOpcionesEscuela(activos);
        });
    }
    if (isPerro) {
      fetch("/api/razas")
        .then((res) => res.json())
        .then((data) => {
          const activos = data.filter((e: any) => e.active === 1 || e.active === true);
          setOpcionesRaza(activos);
        });
    }
  }, [isCompetencia, isPerro]);

  // 🔹 Cargar datos del formulario
  useEffect(() => {
    if (!selectedEntity) return;

    if (isPerro && opcionesRaza.length > 0) {
      const sexoString: "0" | "1" =
        selectedEntity.sexo === "Macho" || selectedEntity.sexo === 1 || selectedEntity.sexo === "1"
          ? "1"
          : "0";

      const datosPerro: PerroForm = {
        Name: selectedEntity?.Name || selectedEntity?.Nombre || "",
        fecha_nacimiento: selectedEntity?.fecha_nacimiento?.slice(0, 10) || "",
        sexo: sexoString,
        chip: selectedEntity?.chip?.toString() || "",
        id_raza: String(selectedEntity?.id_raza ?? ""),
        active: selectedEntity?.active ?? true,
      };

      form.reset(datosPerro);
      form.setValue("sexo", sexoString);
    }

    if (isPersona) {
      const sexoString: "0" | "1" =
        selectedEntity.flg_sexo === "Hombre" || selectedEntity.flg_sexo === 1 || selectedEntity.flg_sexo === "1"
          ? "1"
          : "0";
      const rol: "Usuario" | "Juez" =
        selectedEntity.role === "Juez" || selectedEntity.role === "juez" ? "Juez" : "Usuario";

      const datosPersona: PersonaForm = {
        name: selectedEntity?.Nombre || "",
        lastname: selectedEntity?.Apellidos || "",
        birthdate: selectedEntity?.fec_nacimiento?.slice(0, 10) || "",
        sexo: sexoString,
        email: selectedEntity?.email || "",
        role: rol,
        active: selectedEntity?.active ?? true,
      };

      form.reset(datosPersona);
      form.setValue("sexo", sexoString);
      form.setValue("role", rol);
    }

    if (isCompetencia && opcionesEscuela.length > 0) {
      const idEscuelaStr = String(selectedEntity?.id_escuela ?? "");
      const datosCompetencia: CompetenciaForm = {
        name: selectedEntity?.name || selectedEntity?.Nombre || "",
        id_escuela: idEscuelaStr,
        fec_inicio: selectedEntity?.fec_inicio?.slice(0, 10) || "",
        fec_fin: selectedEntity?.fec_fin?.slice(0, 10) || "",
        active: selectedEntity?.active ?? true,
      };

      form.reset(datosCompetencia);
      form.setValue("id_escuela", idEscuelaStr);
    }

    if (!isCompetencia && !isPersona && !isPerro) {
      form.reset({ name: selectedEntity?.name || "", active: selectedEntity?.active ?? true });
    }
  }, [selectedEntity, form, isPerro, isPersona, isCompetencia, opcionesRaza, opcionesEscuela]);

  // 🔹 Envío del formulario
  async function onSubmit(values: any) {
    try {
      const method = selectedEntity ? "PUT" : "POST";
      const body = {
        ...values,
        id: selectedEntity?.id,
        sexo: isPerro || isPersona ? parseInt(values.sexo) : undefined,
        id_raza: isPerro ? parseInt(values.id_raza) : undefined,
        id_escuela: isCompetencia ? parseInt(values.id_escuela) : undefined,
      };

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
        alert(selectedEntity ? `✅ ${entityType} actualizada` : `✅ ${entityType} agregada`);
        reloadData();
        onCancel();
      }
    } catch (error) {
      console.error("❌ Error en el fetch:", error);
      alert(`❌ Hubo un problema al registrar la ${entityType}`);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {isCompetencia && (
          <>
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de la competencia</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Copa Agility 2025" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="id_escuela" render={({ field }) => (
              <FormItem>
                <FormLabel>Escuela</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar escuela" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {opcionesEscuela.map((esc) => (
                      <SelectItem key={esc.id} value={String(esc.id)}>
                        {esc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="fec_inicio" render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de inicio</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="fec_fin" render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de fin</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
          </>
        )}

        {!isCompetencia && !isPersona && !isPerro && (
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel>{`Nombre de ${entityType}`}</FormLabel>
              <FormControl>
                <Input placeholder={`Nombre de ${entityType}`} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        )}

        <FormField control={form.control} name="active" render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between border p-4">
            <FormLabel className="text-base">Activo</FormLabel>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={(checked) => form.setValue("active", checked)}
              />
            </FormControl>
          </FormItem>
        )} />

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
