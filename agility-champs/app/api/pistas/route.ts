import { NextResponse } from "next/server";
import { pool } from "@/data/db";

// Obtener el ID de la competencia desde los parámetros de la URL
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const competenciaId = searchParams.get("competencia_id");

    if (!competenciaId) {
      return NextResponse.json({ error: "competencia_id es requerido" }, { status: 400 });
    }

    // Consulta SQL con parámetro seguro
    const query = `
      SELECT 
        competencia.des_competencia AS competencia, 
        grado.des_grado AS grado, 
        categoria.des_categoria AS categoria, 
        persona.des_nombres AS juez, 
        pista.num_obstaculos AS obstaculos,
        pista.num_velocidad_maxima AS velocidad_max,
        pista.num_velocidad_minima AS velocidad_min
      FROM pista pista 
      LEFT JOIN competencia competencia ON pista.id_competencia = competencia.id_competencia
      LEFT JOIN grado grado ON pista.id_grado = grado.id_grado
      LEFT JOIN categoria categoria ON pista.id_categoria = categoria.id_categoria
      LEFT JOIN persona persona ON pista.id_persona = persona.id_persona 
      WHERE pista.id_competencia = ?;
    `;

    console.log("Executing query with competencia_id:", competenciaId); // Depuración

    const [rows] = await pool.query(query, [competenciaId]);

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ message: "No se encontraron pistas para esta competencia." }, { status: 404 });
    }

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error al obtener las pistas:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
