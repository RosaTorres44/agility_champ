import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

// 🔹 Definir esquema de validación con Zod
const entidadFormSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }),
  active: z.boolean(),
});

// 🔹 Definir tipos para las props
interface Entidad {
  id?: number;
  name: string;
  active: boolean;
}

interface DynamicFormProps {
  entityType: string; // 🔹 Nombre de la entidad (Escuelas, Categorías, etc.)
  reloadData: () => void;
  selectedEntity?: Entidad | null;
  onCancel: () => void;
}

export function DynamicForm({ entityType = "Entidad", reloadData, selectedEntity, onCancel }: DynamicFormProps) {
  const form = useForm<z.infer<typeof entidadFormSchema>>({
    resolver: zodResolver(entidadFormSchema),
    defaultValues: { name: "", active: true },
    mode: "onChange",
  });

  // 🔹 Actualizar valores del formulario si cambia `selectedEntity`
  useEffect(() => {
    if (selectedEntity) {
      form.reset({
        name: selectedEntity.name || "",
        active: selectedEntity.active ?? true,
      });
    } else {
      form.reset({ name: "", active: true });
    }
  }, [selectedEntity, form]);

  // 🔹 Manejo del submit
  async function onSubmit(values: z.infer<typeof entidadFormSchema>) {
    try {
      const method = selectedEntity ? "PUT" : "POST";
      const body = selectedEntity ? { id: selectedEntity.id, ...values } : values;
      const url = `/api/${entityType.toLowerCase()}`;

      console.log("🔹 Enviando solicitud a:", url);
      console.log("🔹 Datos enviados:", body);

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      console.log("🔹 Respuesta del backend:", data);

      if (data.error) {
        console.error("❌ Error en la API:", data.error);
        alert(`❌ Error: ${data.error}`);
      } else {
        alert(
          selectedEntity
            ? `✅ ${entityType} actualizada exitosamente`
            : `✅ ${entityType} agregada exitosamente`
        );
        reloadData();
        onCancel(); // ✅ Cerrar el formulario después de actualizar
      }
    } catch (error) {
      console.error("❌ Error en el fetch:", error);
      alert(`❌ Hubo un problema al registrar la ${entityType.toLowerCase()}`);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">{`Nombre de ${entityType}`}</FormLabel>
            <FormControl>
              <Input placeholder={`Ingresar nombre de ${entityType}`} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="active" render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between border p-4">
            <FormLabel className="text-base">Activo</FormLabel>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={(checked) => form.setValue("active", checked)} />
            </FormControl>
          </FormItem>
        )} />

        <div className="flex justify-between">
            <Button
            type="submit"
            className="bg-[#6366F1] hover:bg-[#4F46E5]"
            >
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