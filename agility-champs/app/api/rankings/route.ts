import { NextResponse } from "next/server";
import { pool } from "@/data/db";

export async function GET() {
  try {
    const query = `
    SELECT 
    perro.des_nombres AS dogName, 
    persona.des_nombres AS handlerName, 
    grado.des_grado AS grado, 
    categoria.des_categoria  AS categoria, 
    resultado.num_posicion  as rating, 
    '' AS image   
    FROM resultados resultado 
    left join dupla dupla on resultado.id_dupla = dupla.id_dupla 
    left join persona persona on dupla.id_persona = persona.id_persona
    left join perro perro on dupla.id_perro = perro.id_perro 
    left join categoria categoria on dupla.id_categoria = categoria.id_categoria
    left join grado grado on dupla.id_grado = grado.id_grado 
    `;

    console.log("Executing query:", query); // Depuración

    const [rows] = await pool.query(query);

    if (!Array.isArray(rows) || rows.length === 0) {
      console.warn("No se encontraron resultados en la base de datos.");
    }

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error al obtener el ranking:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
