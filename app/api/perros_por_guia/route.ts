import { NextResponse } from "next/server";
import { pool } from "@/data/db";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const query = `
      SELECT 
        pe.des_nombres AS guia, 
        p.des_nombres AS perro
      FROM dupla D
      INNER JOIN perro P ON D.id_perro = P.id_perro
      INNER JOIN persona PE ON D.id_persona = PE.id_persona;
    `;

    console.log("Executing query:", query); // Depuración

    // 🔹 Corrección: Desestructurar correctamente los valores devueltos por `pool.query()`
    const [rows]: any = await pool.query(query); // "rows" es un array de objetos con { guia, perro }

    if (!Array.isArray(rows) || rows.length === 0) {
      console.warn("No se encontraron resultados en la base de datos.");
      return NextResponse.json({ error: "No se encontraron datos" }, { status: 404 });
    }

    // 🔹 Formatear los datos en el objeto esperado
    const perrosPorGuia: Record<string, string[]> = {};

    rows.forEach((row: { guia: string; perro: string }) => {
      if (!perrosPorGuia[row.guia]) {
        perrosPorGuia[row.guia] = ["Perro"]; // Agregar "Perro" como opción inicial
      }
      perrosPorGuia[row.guia].push(row.perro);
    });

    return NextResponse.json(perrosPorGuia);
  } catch (error) {
    console.error("Error al obtener la lista de perros por guía:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
