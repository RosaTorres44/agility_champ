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

type PerroForm = z.infer<typeof esquemaPerro>;
type EntidadForm = z.infer<typeof esquemaEntidad>;

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
  const isPerro = entityType.toLowerCase() === "perros";
  const schema = isPerro ? esquemaPerro : esquemaEntidad;

  const form = useForm<PerroForm | EntidadForm>({
    resolver: zodResolver(schema),
    defaultValues: isPerro
      ? {
          Name: "",
          fecha_nacimiento: "",
          sexo: "0",
          chip: "",
          id_raza: "",
          active: true,
        }
      : {
          name: "",
          active: true,
        },
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
      let sexoString: "0" | "1" = "0";
      if (
        selectedEntity.sexo === "Macho" ||
        selectedEntity.sexo === 1 ||
        selectedEntity.sexo === "1"
      ) {
        sexoString = "1";
      }

      const idRazaString = String(selectedEntity?.id_raza ?? "");
      //alert(`📢 Raza recibida: ${idRazaString}`);

      const datosPerro: PerroForm = {
        Name: selectedEntity?.Name || selectedEntity?.Nombre || "",
        fecha_nacimiento: selectedEntity?.fecha_nacimiento?.slice(0, 10) || "",
        sexo: sexoString,
        chip: selectedEntity?.chip?.toString() || "",
        id_raza: idRazaString,
        active: selectedEntity?.active ?? true,
      };

      form.reset(datosPerro);
    } else if (selectedEntity && !isPerro) {
      const datosEntidad: EntidadForm = {
        name: selectedEntity?.name || "",
        active: selectedEntity?.active ?? true,
      };
      form.reset(datosEntidad);
    } else {
      form.reset(
        isPerro
          ? {
              Name: "",
              fecha_nacimiento: "",
              sexo: "0",
              chip: "",
              id_raza: "",
              active: true,
            }
          : {
              name: "",
              active: true,
            }
      );
    }
  }, [selectedEntity, form, isPerro, razas]);

  async function onSubmit(values: any) {
    try {
      const method = selectedEntity ? "PUT" : "POST";
      const body = {
        ...values,
        sexo: parseInt(values.sexo),
        id_raza: parseInt(values.id_raza),
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
            <FormField control={form.control} name="Name" render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Perro</FormLabel>
                <FormControl>
                  <Input placeholder="Ej. Luna" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="fecha_nacimiento" render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Nacimiento</FormLabel>
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
                    <SelectItem value="0">Hembra</SelectItem>
                    <SelectItem value="1">Macho</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="chip" render={({ field }) => (
              <FormItem>
                <FormLabel>Chip</FormLabel>
                <FormControl>
                  <Input placeholder="Código del chip" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="id_raza" render={({ field }) => (
              <FormItem>
                <FormLabel>Raza</FormLabel>
                <Select value={field.value} onValueChange={(value) => form.setValue("id_raza", value)}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar raza" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {razas.map((r) => (
                      <SelectItem key={r.id} value={String(r.id)}>
                        {r.name}
                      </SelectItem>
                    ))}
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
