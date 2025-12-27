import * as z from "zod";

export const esquemaEntidad = z.object({ name: z.string().min(2), active: z.boolean() });

export const esquemaPerro = z.object({
  Nombre: z.string().min(2),
  fec_nacimiento: z.string(),
  sexo: z.union([z.literal("0"), z.literal("1")]),
  chip: z.string(),
  id_raza: z.string(),
  active: z.boolean(),
});

export const esquemaPersona = z.object({
  name: z.string().min(2),
  lastname: z.string().min(2),
  fec_nacimiento: z.string(),
  flg_sexo: z.union([z.literal("0"), z.literal("1")]),
  email: z.string().email(),
  role: z.enum(["Usuario", "Juez"]),
  active: z.boolean(),
});

export const esquemaCompetencia = z.object({
  name: z.string().min(2),
  id_escuela: z.string().min(1),
  fec_inicio: z.string(),
  fec_fin: z.string(),
  active: z.boolean(),
});

export const esquemaPista = z.object({
  Nombre: z.string().min(2),
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
