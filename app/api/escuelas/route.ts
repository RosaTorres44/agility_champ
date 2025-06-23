import { NextResponse } from "next/server";
import { pool } from "@/data/db";
export const dynamic = "force-dynamic";

// 🔹 Obtener todas las escuelas
export async function GET() {
  try {
    const query = ` SELECT 
        e.id_escuela AS id, 
        e.des_escuela AS Nombre, 
        e.des_escuela AS name, 
        e.flg_activo AS active 
      FROM escuela e`
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




 
 
// 🔹 Insertar una nueva escuela
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📥 Datos recibidos en POST:", body);

    const { Nombre, active } = body;
    console.log("📦 Desestructurados:", { Nombre, active });

    if (!Nombre || typeof active !== "boolean") {
      console.warn("⚠️ Datos inválidos en POST");
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const query = `INSERT INTO escuela (des_escuela, flg_activo) VALUES (?, ?)`;
    await pool.query(query, [Nombre, active ? 1 : 0]);

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

    const { id, Nombre, active } = body;
    console.log("📦 Desestructurados:", { id, Nombre, active });

    if (!id || !Nombre || typeof active !== "boolean") {
      console.warn("⚠️ Datos inválidos en PUT");
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const query = `UPDATE escuela SET des_escuela = ?, flg_activo = ? WHERE id_escuela = ?`;
    await pool.query(query, [Nombre, active ? 1 : 0, id]);

    return NextResponse.json({ message: "Escuela actualizada con éxito" });
  } catch (error) {
    console.error("❌ Error al actualizar escuela:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
