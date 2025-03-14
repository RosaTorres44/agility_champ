import { NextResponse } from "next/server";
import { pool } from "@/data/db";
export const dynamic = "force-dynamic";

// 🔹 Obtener todas las escuelas
export async function GET() {
  try {
    const query = `
      SELECT e.des_escuela AS Nombre, e.flg_activo
      FROM escuela e ORDER BY e.id_escuela ASC
    `;

    console.log("Executing query:", query); // Depuración

    const [rows] = await pool.query(query);

    if (!Array.isArray(rows) || rows.length === 0) {
      console.warn("No se encontraron resultados en la base de datos.");
    }

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error al obtener lista de escuelas:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// 🔹 Insertar una nueva escuela
export async function POST(req: Request) {
  try {
    const { name, active } = await req.json();

    if (!name || typeof active !== "boolean") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const query = `
      INSERT INTO escuela (des_escuela, flg_activo) VALUES (?, ?)
    `;

    await pool.query(query, [name, active ? 1 : 0]);

    return NextResponse.json({ message: "Escuela registrada con éxito" });
  } catch (error) {
    console.error("Error al registrar la escuela:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
