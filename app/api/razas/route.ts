import { NextResponse } from "next/server";
import { pool } from "@/data/db";
export const dynamic = "force-dynamic";

// 🔹 Obtener razas (solo activas si no se indica lo contrario)

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const flg_activo = searchParams.get("flg_activo") || "1";

    const query = `
      SELECT 
        r.id_raza AS id,
        r.des_raza AS nombre,
        r.flg_activo AS flg_activo
      FROM raza r
    `;

    const [rows] = await pool.query(query, [flg_activo]);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}


// 🔹 Insertar una nueva raza
export async function POST(req: Request) {
  try {
    const { nombre, flg_activo } = await req.json();

    if (!nombre || typeof flg_activo !== "boolean") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const query = `INSERT INTO raza (des_raza, flg_activo) VALUES (?, ?)`;
    await pool.query(query, [nombre, flg_activo ? 1 : 0]);

    return NextResponse.json({ message: "Raza registrada con éxito" });
  } catch (error) { 
    console.error("Error al registrar la raza:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// 🔹 Actualizar una raza existente
export async function PUT(req: Request) {
  try {
    const { id, nombre, flg_activo } = await req.json();

    if (!id || !nombre || typeof flg_activo !== "boolean") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const query = `
      UPDATE raza 
      SET des_raza = ?, flg_activo = ? 
      WHERE id_raza = ?
    `;

    const [result]: any = await pool.query(query, [nombre, flg_activo ? 1 : 0, id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Raza no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ message: "Raza actualizada con éxito" });
  } catch (error) {
    console.error("Error al actualizar la raza:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
