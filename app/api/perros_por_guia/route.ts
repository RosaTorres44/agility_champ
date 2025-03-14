import { NextResponse } from "next/server";
import { pool } from "@/data/db";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const query = ` 

      select PE.des_nombres AS guia,  P.des_nombres AS perro  FROM dupla D iNNER JOIN perro P ON D.id_perro = P.id_perro INNER JOIN persona PE ON D.id_persona = PE.id_persona;

    `;

    console.log("Executing query:", query); // Depuración

    // 🔹 Corrección: Obtener filas correctamente
    const [rows]: any = await pool.query(query);

    if (!Array.isArray(rows) || rows.length === 0) {
      console.warn("No se encontraron resultados en la base de datos.");
      return NextResponse.json({ error: "No se encontraron datos" }, { status: 404 });
    }

    // 🔹 Formatear los datos sin agregar "Perro"
    const perrosPorGuia: Record<string, string[]> = {};

    rows.forEach((row: { guia: string; perro: string }) => {
      if (!perrosPorGuia[row.guia]) {
        perrosPorGuia[row.guia] = []; // 🔹 Se inicia sin "Perro"
      }
      perrosPorGuia[row.guia].push(row.perro);
    });

    return NextResponse.json(perrosPorGuia);
  } catch (error) {
    console.error("Error al obtener la lista de perros por guía:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}