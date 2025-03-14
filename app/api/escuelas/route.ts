import { NextResponse } from "next/server";
import { pool } from "@/data/db";
export const dynamic = "force-dynamic";

// 🔹 Obtener todas las escuelas
export async function GET() {
  try {
    const query = `
      SELECT e.id_escuela AS id, e.des_escuela AS name, e.flg_activo AS active
      FROM escuela e ORDER BY e.id_escuela ASC
    `;

    const [rows] = await pool.query(query);

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

// 🔹 Actualizar una escuela existente
export async function PUT(req: Request) {
  try {
    const { id, name, active } = await req.json();

    if (!id || !name || typeof active !== "boolean") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const query = `
      UPDATE escuela 
      SET des_escuela = ?, flg_activo = ? 
      WHERE id_escuela = ?
    `;

    const [result]: any = await pool.query(query, [name, active ? 1 : 0, id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Escuela no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ message: "Escuela actualizada con éxito" });
  } catch (error) {
    console.error("Error al actualizar la escuela:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
