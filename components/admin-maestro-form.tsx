import { useState } from "react";
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

// 🔹 Definir esquema para escuela
const escuelaFormSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre de la escuela debe tener al menos 2 caracteres.",
  }),
  active: z.boolean().default(true),
});

// 🔹 Tipo de formulario
interface DynamicFormProps {
  reloadData: () => void; // 🔹 Nueva función para recargar la lista de escuelas
}

export function DynamicForm({ reloadData }: DynamicFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof escuelaFormSchema>>({
    resolver: zodResolver(escuelaFormSchema),
    defaultValues: { name: "", active: true },
  });

  async function onSubmit(values: z.infer<typeof escuelaFormSchema>) {
    setLoading(true);
    try {
      const response = await fetch("/api/escuelas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (data.error) {
        alert(`Error: ${data.error}`);
      } else {
        alert("✅ Escuela agregada exitosamente");
        reloadData(); // 🔹 Recargar la lista de escuelas
        form.reset(); // 🔹 Limpiar el formulario después de agregar
      }
    } catch (error) {
      alert("❌ Hubo un problema al registrar la escuela");
    }
    setLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* 🔹 Campo Nombre */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Nombre de Escuela</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ingresar Nombre de la Escuela"
                  className="border-[#D1D5DB]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 🔹 Switch para estado activo/inactivo */}
        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[#D1D5DB] p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Activo</FormLabel>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-[#6366F1]"
                />
              </FormControl>
            </FormItem>
          )}
        />

        {/* 🔹 Botón de enviar */}
        <Button type="submit" className="bg-[#6366F1] hover:bg-[#4F46E5]" disabled={loading}>
          {loading ? "Agregando..." : "Agregar Escuela"}
        </Button>
      </form>
    </Form>
  );
}
