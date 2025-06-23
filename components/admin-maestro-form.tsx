// 📁 admin-maestro-form.tsx
"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form"; 
import { renderCampo, renderSelect, renderSwitch } from "@/components/form-fields";

// 🧩 Esquemas
const esquemaEntidad = z.object({ name: z.string().min(2), active: z.boolean() });
const esquemaPerro = z.object({
  Nombre: z.string().min(2),
  fec_nacimiento: z.string(),
  sexo: z.union([z.literal("0"), z.literal("1")]),
  chip: z.string(),
  id_raza: z.string(),
  active: z.boolean(),
});
const esquemaPersona = z.object({
  name: z.string().min(2),
  lastname: z.string().min(2),
  fec_nacimiento: z.string(),
  flg_sexo: z.union([z.literal("0"), z.literal("1")]),
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
const esquemaPista = z.object({
  des_pista: z.string().min(2),
  id_competencia: z.string(),
  id_grado: z.string(),
  id_categoria: z.string(),
  id_persona: z.string(),
  num_obstaculos: z.string(),
  num_longitud: z.string(),
  num_velocidad_maxima: z.string(),
  num_velocidad_minima: z.string(),
  num_tiempo_maximo: z.string(),
  num_tiempo_minimo: z.string(),
  des_tipo: z.string().min(1),
  active: z.boolean(),
});

type Option = { id: number | string; name: string };
interface DynamicFormProps {
  entityType: string;
  reloadData: () => void;
  selectedEntity?: any;
  onCancel: () => void;
}

export function DynamicForm({ entityType, reloadData, selectedEntity, onCancel }: DynamicFormProps) {
  const key = entityType.toLowerCase();
  const isPerro = key === "perros";
  const isPersona = key === "personas" || key === "usuarios";
  const isCompetencia = key === "competencias";
  const isPista = key === "pistas";

  const schema = isPerro ? esquemaPerro : isPersona ? esquemaPersona : isCompetencia ? esquemaCompetencia : isPista ? esquemaPista : esquemaEntidad;

  const form = useForm<any>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: isPerro
      ? { Nombre: "", fec_nacimiento: "", sexo: "0", chip: "", id_raza: "", active: true }
      : isPersona
      ? { name: "", lastname: "", fec_nacimiento: "", flg_sexo: "0", email: "", role: "Usuario", active: true }
      : isCompetencia
      ? { name: "", id_escuela: "", fec_inicio: "", fec_fin: "", active: true }
      : isPista
      ? { des_pista: "", id_competencia: "", id_grado: "", id_categoria: "", id_persona: "", num_obstaculos: "", num_longitud: "", num_velocidad_maxima: "", num_velocidad_minima: "", num_tiempo_maximo: "", num_tiempo_minimo: "", des_tipo: "", active: true }
      : { name: "", active: true },
  });

  const [opciones, setOpciones] = useState<Record<string, Option[]>>({ razas: [], escuelas: [], competencias: [], grados: [], categorias: [], personas: [] });

  useEffect(() => {
    async function cargar() {
      if (isPerro) {
        const razas = await fetch("/api/razas?flg_activo=1").then((r) => r.json());
        setOpciones((prev) => ({ ...prev, razas }));
      }
      if (isCompetencia) {
        const escuelas_all = await fetch("/api/escuelas").then((r) => r.json());
        const escuelas = escuelas_all.filter((escuela: any) => escuela.active === 1);
        setOpciones((prev) => ({ ...prev, escuelas: escuelas_all }));
        setOpciones((prev) => ({ ...prev, escuelas }));
      }
      if (isPista) {
        const [competencias, grados, categorias, personas] = await Promise.all([
          fetch("/api/competencias").then((r) => r.json()),
          fetch("/api/grados").then((r) => r.json()),
          fetch("/api/categorias").then((r) => r.json()),
          fetch("/api/personas").then((r) => r.json()), 
        ]);
        setOpciones((prev) => ({ ...prev, competencias, grados, categorias, personas }));
      }
    }
    cargar();
  }, [isPerro, isCompetencia, isPista]);

  useEffect(() => {
    if (!selectedEntity) return;
    const parse = (f: any) => f?.slice(0, 10) || "";
    const reset = form.reset;

    if (isPerro) return reset({ ...selectedEntity, sexo: String(selectedEntity.sexo ?? "0"), chip: String(selectedEntity.chip || ""), id_raza: String(selectedEntity.id_raza || ""), fec_nacimiento: parse(selectedEntity.fec_nacimiento), active: Boolean(selectedEntity.active) });
    if (isPersona) return reset({ name: selectedEntity.Nombre || "", lastname: selectedEntity.Apellidos || "", fec_nacimiento: parse(selectedEntity.fec_nacimiento), flg_sexo: String(selectedEntity.flg_sexo ?? "0"), email: selectedEntity.email || "", role: selectedEntity.role === "Juez" ? "Juez" : "Usuario", active: Boolean(selectedEntity.active) });
    if (isCompetencia) return reset({ name: selectedEntity.Nombre || "", id_escuela: String(selectedEntity.id_escuela || ""), fec_inicio: parse(selectedEntity.fec_inicio), fec_fin: parse(selectedEntity.fec_fin), active: Boolean(selectedEntity.active) });
    if (isPista) return reset({ ...selectedEntity, id_competencia: String(selectedEntity.id_competencia || ""), id_grado: String(selectedEntity.id_grado || ""), id_categoria: String(selectedEntity.id_categoria || ""), id_persona: String(selectedEntity.id_persona || ""), active: Boolean(selectedEntity.active) });
    return reset({ name: selectedEntity.name || "", active: Boolean(selectedEntity.active) });
  }, [selectedEntity]);

  async function onSubmit(values: any) {
    const method = selectedEntity ? "PUT" : "POST";
    const url = `/api/${key}`;

    const payload: any = { id: selectedEntity?.id, active: values.active };
    if (isPerro) Object.assign(payload, { Nombre: values.Nombre, fec_nacimiento: values.fec_nacimiento, sexo: parseInt(values.sexo), chip: values.chip, id_raza: parseInt(values.id_raza), flg_activo: values.active ? 1 : 0 });
    if (isPersona) Object.assign(payload, { name: values.name, lastname: values.lastname, fec_nacimiento: values.fec_nacimiento, flg_sexo: parseInt(values.flg_sexo), email: values.email, role: values.role });
    if (isCompetencia) Object.assign(payload, { name: values.name, id_escuela: parseInt(values.id_escuela),escuela: parseInt(values.escuela), fec_inicio: values.fec_inicio, fec_fin: values.fec_fin });
    if (isPista) Object.assign(payload, values);
    if (!isPerro && !isPersona && !isCompetencia && !isPista) payload.name = values.name;

    const response = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const data = await response.json();
    if (data.error) alert(`❌ Error: ${data.error}`);
    else {
      alert(`✅ ${entityType} ${selectedEntity ? "actualizado" : "agregado"}`);
      reloadData();
      onCancel();
    }
  }

  const camposPorTipo = () => {
    if (isPerro) return (<>{renderCampo(form, "Nombre", "Nombre del perro")}{renderCampo(form, "fec_nacimiento", "Fecha nacimiento", "date")}{renderSelect(form, "sexo", "Sexo", [{ id: 0, name: "Hembra" }, { id: 1, name: "Macho" }])}{renderCampo(form, "chip", "Chip")}{renderSelect(form, "id_raza", "Raza", opciones.razas)}</>);
    if (isPersona) return (<>{renderCampo(form, "name", "Nombres")}{renderCampo(form, "lastname", "Apellidos")}{renderCampo(form, "fec_nacimiento", "Fecha nacimiento", "date")}{renderSelect(form, "flg_sexo", "Sexo", [{ id: "0", name: "Mujer" }, { id: "1", name: "Hombre" }])}{renderCampo(form, "email", "Email", "email")}{renderSelect(form, "role", "Rol", [{ id: "Usuario", name: "Usuario" }, { id: "Juez", name: "Juez" }])}</>);
    if (isCompetencia) return (<>{renderCampo(form, "name", "Nombre competencia")}{renderSelect(form, "id_escuela", "Escuela", opciones.escuelas)}{renderCampo(form, "fec_inicio", "Fecha inicio", "date")}{renderCampo(form, "fec_fin", "Fecha fin", "date")}</>);
    if (isPista) return (<>{renderCampo(form, "des_pista", "Descripción pista")}{renderSelect(form, "id_competencia", "Competencia", opciones.competencias)}{renderSelect(form, "id_grado", "Grado", opciones.grados)}{renderSelect(form, "id_categoria", "Categoría", opciones.categorias)}{renderSelect(form, "id_persona", "Juez", opciones.personas)}{renderCampo(form, "num_obstaculos", "N° Obstáculos")}{renderCampo(form, "num_longitud", "Longitud")}{renderCampo(form, "num_velocidad_maxima", "Velocidad máxima")}{renderCampo(form, "num_velocidad_minima", "Velocidad mínima")}{renderCampo(form, "num_tiempo_maximo", "Tiempo máximo")}{renderCampo(form, "num_tiempo_minimo", "Tiempo mínimo")}{renderCampo(form, "des_tipo", "Tipo")}</>);
    return renderCampo(form, "name", `Nombre de ${entityType}`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {camposPorTipo()}
        {renderSwitch(form, "active", "Activo")}
        <div className="flex justify-between">
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
            {selectedEntity ? `Actualizar ${entityType}` : `Agregar ${entityType}`}
          </Button>
          <Button type="button" className="bg-red-600 hover:bg-red-700" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
}



