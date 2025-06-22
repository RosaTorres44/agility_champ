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

type PerroForm = z.infer<typeof esquemaPerro>;
type EntidadForm = z.infer<typeof esquemaEntidad>;
type PersonaForm = z.infer<typeof esquemaPersona>;

interface RazaOption {
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
  const schema = isPerro ? esquemaPerro : isPersona ? esquemaPersona : esquemaEntidad;

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
      : { name: "", active: true },
    mode: "onChange",
  });

  const [razas, setRazas] = useState<RazaOption[]>([]);

  useEffect(() => {
    if (isPerro) {
      fetch("/api/razas")
        .then((res) => res.json())
        .then((data) =>
          setRazas(data.sort((a: RazaOption, b: RazaOption) => a.name.localeCompare(b.name)))
        );
    }
  }, [isPerro]);

  useEffect(() => {
    if (selectedEntity && isPerro && razas.length > 0) {
      const sexoString: "0" | "1" =
        selectedEntity.sexo === "Macho" || selectedEntity.sexo === 1 || selectedEntity.sexo === "1"
          ? "1"
          : "0";

      const idRazaString = String(selectedEntity?.id_raza ?? "");
      const datosPerro: PerroForm = {
        Name: selectedEntity?.Name || selectedEntity?.Nombre || "",
        fecha_nacimiento: selectedEntity?.fecha_nacimiento?.slice(0, 10) || "",
        sexo: sexoString,
        chip: selectedEntity?.chip?.toString() || "",
        id_raza: idRazaString,
        active: selectedEntity?.active ?? true,
      };

      form.reset(datosPerro);
      form.setValue("sexo", sexoString);
    } else if (selectedEntity && isPersona) {
      const sexoString: "0" | "1" =
        selectedEntity.flg_sexo === "Hombre" || selectedEntity.flg_sexo === 1 || selectedEntity.flg_sexo === "1"
          ? "1"
          : "0";

      const rol: "Usuario" | "Juez" =
        selectedEntity.role === "Juez" || selectedEntity.role === "juez" ? "Juez" : "Usuario";

      const datosPersona: PersonaForm = {
        name: selectedEntity?.Nombre || selectedEntity?.name || "",
        lastname: selectedEntity?.Apellidos || selectedEntity?.lastname || "",
        birthdate: selectedEntity?.fec_nacimiento?.slice(0, 10) || selectedEntity?.birthdate || "",
        sexo: sexoString,
        email: selectedEntity?.email || "",
        role: rol,
        active: selectedEntity?.active ?? true,
      };

      form.reset(datosPersona);
      form.setValue("sexo", sexoString);
      form.setValue("role", rol);
    } else if (!isPerro && !isPersona) {
      form.reset({ name: "", active: true });
    }
  }, [selectedEntity, form, isPerro, isPersona, razas]);

  async function onSubmit(values: any) {
    try {
      const method = selectedEntity ? "PUT" : "POST";
      const body = {
        ...values,
        sexo: isPerro || isPersona ? parseInt(values.sexo) : undefined,
        id_raza: isPerro ? parseInt(values.id_raza) : undefined,
        id: selectedEntity?.id,
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
        alert(
          selectedEntity
            ? `✅ ${entityType} actualizada exitosamente`
            : `✅ ${entityType} agregada exitosamente`
        );
        reloadData();
        onCancel();
      }
    } catch (error) {
      console.error("❌ Error en el fetch:", error);
      alert(`❌ Hubo un problema al registrar la ${entityType.toLowerCase()}`);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {isPerro ? (
          <>
            {/* Aquí puedes poner los campos de perro si los necesitas */}
          </>
        ) : isPersona ? (
          <>
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="lastname" render={({ field }) => (
              <FormItem>
                <FormLabel>Apellidos</FormLabel>
                <FormControl>
                  <Input placeholder="Apellidos" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="birthdate" render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de nacimiento</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="sexo" render={({ field }) => (
              <FormItem>
                <FormLabel>Sexo</FormLabel>
                <Select value={field.value} onValueChange={(value) => form.setValue("sexo", value as "0" | "1")}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar sexo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0">Mujer</SelectItem>
                    <SelectItem value="1">Hombre</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="ejemplo@correo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="role" render={({ field }) => (
              <FormItem>
                <FormLabel>Rol</FormLabel>
                <Select value={field.value} onValueChange={(value) => form.setValue("role", value)}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Usuario">Usuario</SelectItem>
                    <SelectItem value="Juez">Juez</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />
          </>
        ) : (
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel>{`Nombre de ${entityType}`}</FormLabel>
              <FormControl>
                <Input placeholder={`Ingresar nombre de ${entityType}`} {...field} />
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
