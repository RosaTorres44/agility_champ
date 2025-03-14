import { NextResponse } from "next/server";
import { pool } from "@/data/db";
export const dynamic = "force-dynamic";


export async function GET() {
  try {
    const query = "SELECT des_categoria Nombre FROM categoria ORDER BY id_categoria ASC";
    console.log("Executing query:", query); // Depuración

    const [rows] = await pool.query(query);

    if (Array.isArray(rows) && rows.length === 0) {
      console.warn("No se encontraron categorías en la base de datos.");
    }

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}


// 🔹 Insertar una nueva categoria
export async function POST(req: Request) {
  try {
    const { name, active } = await req.json();

    if (!name || typeof active !== "boolean") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const query = `
      INSERT INTO categoria (des_categoria, flg_activo) VALUES (?, ?)
    `;

    await pool.query(query, [name, active ? 1 : 0]);

    return NextResponse.json({ message: "Categoria registrada con éxito" });
  } catch (error) {
    console.error("Error al registrar la categoria:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// 🔹 Actualizar una categoria existente
export async function PUT(req: Request) {
  try {
    const { id, name, active } = await req.json();

    if (!id || !name || typeof active !== "boolean") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const query = `
      UPDATE categoria 
      SET des_categoria = ?, flg_activo = ? 
      WHERE id_categoria= ?
    `;

    const [result]: any = await pool.query(query, [name, active ? 1 : 0, id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Categoria no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ message: "Categoria actualizada con éxito" });
  } catch (error) {
    console.error("Error al actualizar la Categoria:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
