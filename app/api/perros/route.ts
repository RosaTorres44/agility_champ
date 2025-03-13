import { NextResponse } from "next/server";
import { pool } from "@/data/db";
export const dynamic = "force-dynamic";


export async function GET() {
  try {
    const query = `
     SELECT 
        p.id_perro  as id , des_nombres as Nombre  , flg_activo AS active
   FROM perro p  ; 
    `;

    console.log("Executing query:", query); // Depuración

    const [rows] = await pool.query(query);

    if (!Array.isArray(rows) || rows.length === 0) {
      console.warn("No se encontraron resultados en la base de datos.");
    }

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error al obtener lista de usuarios:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
