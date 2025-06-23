import { NextResponse } from "next/server";
import { pool } from "@/data/db";
export const dynamic = "force-dynamic";


export async function GET() {
  try {
    const query = "SELECT c.id_grado AS id, c.des_grado AS Nombre,  c.des_grado AS Nombre, c.flg_activo AS active FROM grado c ORDER BY c.id_grado ASC";
    console.log("Executing query:", query); // Depuración

    const [rows] = await pool.query(query);

    if (Array.isArray(rows) && rows.length === 0) {
      console.warn("No se encontraron grado en la base de datos.");
    }

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error al obtener las grado:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}


// 🔹 Insertar una nueva grado
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Datos recibidos en POST:", body); // 🔹 Verifica los datos

    const { name, active } = body;

    if (!name || typeof active !== "boolean") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const query = `INSERT INTO grado (des_grado, flg_activo) VALUES (?, ?)`;
    await pool.query(query, [name, active ? 1 : 0]);

    return NextResponse.json({ message: "grado registrada con éxito" });
  } catch (error) { 
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// 🔹 Actualizar una grado existente
export async function PUT(req: Request) {
  try {
    const { id, name, active } = await req.json();

    if (!id || !name || typeof active !== "boolean") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const query = `
      UPDATE grado  
      SET des_grado = ?, flg_activo = ? 
      WHERE id_grado= ?
    `;

    const [result]: any = await pool.query(query, [name, active ? 1 : 0, id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "grado no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ message: "grado actualizada con éxito" });
  } catch (error) {
    console.error("Error al actualizar la grado:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
