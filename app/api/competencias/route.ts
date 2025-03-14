import { NextResponse } from "next/server";
import { pool } from "@/data/db";
export const dynamic = "force-dynamic";


// 🔹 Obtener todas las competencias
export async function GET() {
  try {
    const query = `
      select c.id_competencia, des_competencia nombre , fec_inicio, e.des_escuela as Escuela, c.flg_activo
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

 
// 🔹 Insertar una nueva competencia
export async function POST(req: Request) {
  try {
    const { name, active } = await req.json();

    if (!name || typeof active !== "boolean") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const query = `
      INSERT INTO competencia (des_competencia, id_escuela, fec_inicio, fec_fin) VALUES (?, ?, ?, ?)
    `;

    await pool.query(query, [name, active ? 1 : 0]);

    return NextResponse.json({ message: "Competencia registrada con éxito" });
  } catch (error) {
    console.error("Error al registrar la Competencia:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// 🔹 Actualizar una competencia existente
export async function PUT(req: Request) {
  try {
    const { id, name, active } = await req.json();

    if (!id || !name || typeof active !== "boolean") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const query = `
      UPDATE competencia 
      SET des_competencia = ?, id_escuela = ? , fec_inicio = ? , fec_fin = ? , flg_activo = ? 
      WHERE id_competencia = ?
    `;

    const [result]: any = await pool.query(query, [name, active ? 1 : 0, id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Competencia no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ message: "Competencia actualizada con éxito" });
  } catch (error) {
    console.error("Error al actualizar la Competencia:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
