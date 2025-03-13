import { NextResponse } from "next/server";
import { pool } from "@/data/db";

export async function GET() {
  try {
    const query = `
        SELECT 
        perro.des_nombres AS dogName, 
        persona.des_nombres AS handlerName, 
        grado.des_grado AS grado, 
        categoria.des_categoria AS categoria, 
        pista.des_pista AS pista,
        resultado.num_posicion AS rating, 
        '' AS image    ,
        competencia.flg_activo ,
        competencia.des_competencia AS competitionName 
        FROM resultados resultado 
        LEFT JOIN pista pista ON resultado.id_pista = pista.id_pista
        LEFT JOIN competencia competencia ON pista.id_competencia = competencia.id_competencia
        LEFT JOIN dupla dupla ON resultado.id_dupla = dupla.id_dupla 
        LEFT JOIN persona persona ON dupla.id_persona = persona.id_persona
        LEFT JOIN perro perro ON dupla.id_perro = perro.id_perro 
        LEFT JOIN categoria categoria ON dupla.id_categoria = categoria.id_categoria
        LEFT JOIN grado grado ON dupla.id_grado = grado.id_grado
        WHERE competencia.flg_activo = 
        (CASE 
        WHEN EXISTS (SELECT 1 FROM competencia WHERE flg_activo = 1) THEN 1
        ELSE -1
        END);
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
