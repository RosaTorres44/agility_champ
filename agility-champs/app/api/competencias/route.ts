import { NextResponse } from "next/server";
import { pool } from "@/data/db";

export async function GET() {
  try {
    const query = `
    select des_competencia , fec_inicio, e.des_escuela as Escuela, c.flg_activo
    from competencia c inner join escuela e on c.id_escuela = e.id_escuela  order by c.flg_activo desc; 
    `;

    console.log("Executing query:", query); // Depuración

    const [rows] = await pool.query(query);

    if (!Array.isArray(rows) || rows.length === 0) {
      console.warn("No se encontraron resultados en la base de datos.");
    }

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error al obtener lista de competencias:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
