import { NextResponse } from "next/server";
import { pool } from "@/data/db";

export async function GET() {
  try {
    const query = `
    SELECT 
         CompetenciaID as id , Nombre as name , FechaInicio as email, FechaFin as role 
   FROM Competencias u    ; ; 
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
