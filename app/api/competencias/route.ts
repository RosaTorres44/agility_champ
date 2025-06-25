import { NextResponse } from "next/server";
import { pool } from "@/data/db";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const flg_activo = searchParams.get("flg_activo") || "1";

    const query = `
      SELECT c.id_competencia AS id,
             c.des_competencia AS nombre,
             c.id_escuela,
             e.des_escuela AS escuela,
             c.fec_inicio,
             c.fec_fin,
             c.flg_activo AS flg_activo
      FROM competencia c
      INNER JOIN escuela e ON c.id_escuela = e.id_escuela where e.flg_activo =1
      ORDER BY c.flg_activo DESC, c.fec_inicio DESC
    `;

    const [rows] = await pool.query(query, [flg_activo]);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}


// 🔹 Crear nueva competencia
export async function POST(req: Request) {
  try {
    const { nombre, id_escuela, fec_inicio, fec_fin, flg_activo } = await req.json();

    if (!nombre || !id_escuela || !fec_inicio || !fec_fin || typeof flg_activo !== "boolean") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const query = `
      INSERT INTO competencia (des_competencia, id_escuela, fec_inicio, fec_fin, flg_activo, fec_creacion)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    await pool.query(query, [nombre, id_escuela, fec_inicio, fec_fin, flg_activo ? 1 : 0]);
    return NextResponse.json({ message: "Competencia registrada con éxito" });
  } catch (error) {
    console.error("Error al registrar competencia:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// 🔹 Actualizar competencia existente
export async function PUT(req: Request) {
  try {
    const { id, nombre, id_escuela, fec_inicio, fec_fin, flg_activo } = await req.json();

    if (!id || !nombre || !id_escuela || !fec_inicio || !fec_fin || typeof flg_activo !== "boolean") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const query = `
      UPDATE competencia
      SET des_competencia = ?, id_escuela = ?, fec_inicio = ?, fec_fin = ?, flg_activo = ?
      WHERE id_competencia = ?
    `;
    const [result]: any = await pool.query(query, [nombre, id_escuela, fec_inicio, fec_fin, flg_activo ? 1 : 0, id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Competencia no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ message: "Competencia actualizada con éxito" });
  } catch (error) {
    console.error("Error al actualizar competencia:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
