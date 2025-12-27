import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export const renderCampo = (form: any, nombre: string, label: string, type = "text") => (
  <FormField control={form.control} name={nombre} render={({ field }) => (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <FormControl>
        <Input type={type} {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )} />
);

export const renderSelect = (
  form: any,
  nombre: string,
  label: string,
  opciones: { id: number | string; nombre: string }[]
) => (
  <FormField control={form.control} name={nombre} render={({ field }) => (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <Select value={field.value} onValueChange={field.onChange}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder={`Seleccionar ${label.toLowerCase()}`} />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {opciones.map((opt) => (
            <SelectItem key={opt.id} value={String(opt.id)}>
              {opt.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )} />
);

export const renderSwitch = (form: any, nombre: string, label: string) => (
  <FormField control={form.control} name={nombre} render={({ field }) => (
    <FormItem className="flex items-center justify-between border p-4">
      <FormLabel className="text-base">{label}</FormLabel>
      <FormControl>
        <Switch
          checked={field.value}
          onCheckedChange={(checked) => form.setValue(nombre, checked)}
        />
      </FormControl>
    </FormItem>
  )} />
);
