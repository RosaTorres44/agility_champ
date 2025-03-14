import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

// 🔹 Definir esquema de validación con Zod
const escuelaFormSchema = z.object({
  name: z.string().min(2, { message: "El nombre de la escuela debe tener al menos 2 caracteres." }),
  active: z.boolean(),
});

// 🔹 Definir tipos para las props
interface Escuela {
  id?: number;
  name: string;
  active: boolean;
}

interface DynamicFormProps {
  reloadData: () => void;
  selectedUser?: Escuela | null;
  onCancel: () => void;
}

export function DynamicForm({ reloadData, selectedUser, onCancel }: DynamicFormProps) {
  const form = useForm<z.infer<typeof escuelaFormSchema>>({
    resolver: zodResolver(escuelaFormSchema),
    defaultValues: { name: "", active: true },
    mode: "onChange",
  });

  // 🔹 Actualizar valores del formulario si cambia `selectedUser`
  useEffect(() => {
    form.reset({
      name: selectedUser?.name || "",
      active: selectedUser?.active ?? true,
    });
  }, [selectedUser, form]);

  // 🔹 Manejo del submit
  async function onSubmit(values: z.infer<typeof escuelaFormSchema>) {
    try {
      const method = selectedUser ? "PUT" : "POST";
      const body = selectedUser ? { id: selectedUser.id, ...values } : values;

      const response = await fetch("/api/escuelas", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (data.error) {
        alert(`❌ Error: ${data.error}`);
      } else {
        alert(selectedUser ? "✅ Escuela actualizada exitosamente" : "✅ Escuela agregada exitosamente");
        reloadData();
        onCancel(); // ✅ Cerrar el formulario después de actualizar
      }
    } catch (error) {
      alert("❌ Hubo un problema al registrar la escuela");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Nombre de Escuela</FormLabel>
            <FormControl><Input placeholder="Ingresar Nombre de la Escuela" {...field} /></FormControl>
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
          <Button type="submit" className="bg-[#6366F1] hover:bg-[#4F46E5]">
            {selectedUser ? "Actualizar Escuela" : "Agregar Escuela"}
          </Button>
          <Button type="button" className="bg-red-500 hover:bg-red-700" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}
