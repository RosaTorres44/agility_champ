import { NextResponse } from "next/server";
import { pool } from "@/data/db";
export const dynamic = "force-dynamic";

// 🔹 Obtener todas las escuelas

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const flg_activo = searchParams.get("flg_activo") || "1";

    const query = `
     SELECT 
        e.id_escuela AS id, 
        e.des_escuela AS nombre,  
        e.flg_activo AS flg_activo 
      FROM escuela e
    `;

    const [rows] = await pool.query(query, [flg_activo]);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}


 
 
// 🔹 Insertar una nueva escuela
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📥 Datos recibidos en POST:", body);

    const { nombre, flg_activo } = body;
    console.log("📦 Desestructurados:", { nombre, flg_activo });

    if (!nombre || typeof flg_activo !== "boolean") {
      console.warn("⚠️ Datos inválidos en POST");
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const query = `INSERT INTO escuela (des_escuela, flg_activo) VALUES (?, ?)`;
    await pool.query(query, [nombre, flg_activo ? 1 : 0]);

    return NextResponse.json({ message: "Escuela registrada con éxito" });
  } catch (error) {
    console.error("❌ Error al insertar escuela:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// 🔹 Actualizar escuela existente
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    console.log("📥 Datos recibidos en PUT:", body);

    const { id, nombre, flg_activo } = body;
    console.log("📦 Desestructurados:", { id, nombre, flg_activo });

    if (!id || !nombre || typeof flg_activo !== "boolean") {
      console.warn("⚠️ Datos inválidos en PUT");
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const query = `UPDATE escuela SET des_escuela = ?, flg_activo = ? WHERE id_escuela = ?`;
    await pool.query(query, [nombre, flg_activo ? 1 : 0, id]);

    return NextResponse.json({ message: "Escuela actualizada con éxito" });
  } catch (error) {
    console.error("❌ Error al actualizar escuela:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
