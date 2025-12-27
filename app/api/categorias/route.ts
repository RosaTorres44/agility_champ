import { NextResponse } from "next/server";
import { pool } from "@/data/db";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const flg_activo = searchParams.get("flg_activo") || "1";

    const query = `
      SELECT 
        c.id_categoria AS id,
        c.des_categoria AS nombre,
        c.flg_activo AS flg_activo 
      FROM categoria c  
      ORDER BY c.id_categoria ASC
    `;

    const [rows] = await pool.query(query, [flg_activo]);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}


// 🔹 Insertar una nueva categoria
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Datos recibidos en POST:", body); // 🔹 Verifica los datos

    const { nombre, flg_activo } = body;

    if (!nombre || typeof flg_activo !== "boolean") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const query = `INSERT INTO categoria (des_categoria, flg_activo) VALUES (?, ?)`;
    await pool.query(query, [nombre, flg_activo ? 1 : 0]);

    return NextResponse.json({ message: "Categoria registrada con éxito" });
  } catch (error) { 
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// 🔹 Actualizar una categoria existente
export async function PUT(req: Request) {
  try {
    const { id, nombre, flg_activo } = await req.json();

    if (!id || !nombre || typeof flg_activo !== "boolean") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const query = `
      UPDATE categoria  
      SET des_categoria = ?, flg_activo = ? 
      WHERE id_categoria= ?
    `;

    const [result]: any = await pool.query(query, [nombre, flg_activo ? 1 : 0, id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Categoria no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ message: "Categoria actualizada con éxito" });
  } catch (error) {
    console.error("Error al actualizar la Categoria:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
