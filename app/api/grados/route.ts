import { NextResponse } from "next/server";
import { pool } from "@/data/db";
export const dynamic = "force-dynamic";


export async function GET() {
  try {
    const query = "SELECT des_grado Nombre FROM grado ORDER BY id_grado ASC";
    console.log("Executing query:", query); // Depuración

    const [rows] = await pool.query(query);

    if (Array.isArray(rows) && rows.length === 0) {
      console.warn("No se encontraron grados en la base de datos.");
    }

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error al obtener los grados:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
