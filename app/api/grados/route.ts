
import { NextResponse } from "next/server";
import { pool } from "@/data/db";
export const dynamic = "force-dynamic";

// 🔹 Obtener todas las escuelas

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const flg_activo = searchParams.get("flg_activo") || "1";

    const query = `
      SELECT c.id_grado AS id, 
      c.des_grado AS nombre,   
      c.flg_activo AS flg_activo 
      FROM grado c 
      ORDER BY c.id_grado ASC
    `;

    const [rows] = await pool.query(query, [flg_activo]);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}


// 🔹 Insertar una nueva grado
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Datos recibidos en POST:", body); // 🔹 Verifica los datos

    const { nombre, flg_activo } = body;

    if (!nombre || typeof flg_activo !== "boolean") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const query = `INSERT INTO grado (des_grado, flg_activo) VALUES (?, ?)`;
    await pool.query(query, [nombre, flg_activo ? 1 : 0]);

    return NextResponse.json({ message: "grado registrada con éxito" });
  } catch (error) { 
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// 🔹 Actualizar una grado existente
export async function PUT(req: Request) {
  try {
    const { id, nombre, flg_activo } = await req.json();

    if (!id || !nombre || typeof flg_activo !== "boolean") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const query = `
      UPDATE grado  
      SET des_grado = ?, flg_activo = ? 
      WHERE id_grado= ?
    `;

    const [result]: any = await pool.query(query, [nombre, flg_activo ? 1 : 0, id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "grado no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ message: "grado actualizada con éxito" });
  } catch (error) {
    console.error("Error al actualizar la grado:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
