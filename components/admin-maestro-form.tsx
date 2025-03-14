import { useState, useEffect } from "react";
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

const escuelaFormSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre de la escuela debe tener al menos 2 caracteres.",
  }),
  active: z.boolean(),
});

interface DynamicFormProps {
  reloadData: () => void;
  selectedUser?: { id: number; name: string; active: boolean | number } | null;
}

export function DynamicForm({ reloadData, selectedUser }: DynamicFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof escuelaFormSchema>>({
    resolver: zodResolver(escuelaFormSchema),
    defaultValues: {
      name: selectedUser?.name || "",
      active: Boolean(selectedUser?.active), // Asegurar que active sea booleano
    },
  });

  useEffect(() => {
    form.reset({
      name: selectedUser?.name || "",
      active: Boolean(selectedUser?.active),
    });
  }, [selectedUser, form]);

  async function onSubmit(values: z.infer<typeof escuelaFormSchema>) {
    setLoading(true);
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
        form.reset({ name: "", active: true });
      }
    } catch (error) {
      alert("❌ Hubo un problema al registrar la escuela");
    }
    setLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Nombre de Escuela</FormLabel>
              <FormControl>
                <Input placeholder="Ingresar Nombre de la Escuela" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[#D1D5DB] p-4">
              <FormLabel className="text-base">Activo</FormLabel>
              <FormControl>
                <Switch
                  checked={field.value === true}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-[#6366F1]"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="bg-[#6366F1] hover:bg-[#4F46E5]" disabled={loading}>
          {loading ? "Guardando..." : selectedUser ? "Actualizar Escuela" : "Agregar Escuela"}
        </Button>
      </form>
    </Form>
  );
}
