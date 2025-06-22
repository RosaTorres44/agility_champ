import { NextResponse } from "next/server";
import { pool } from "@/data/db";

export const dynamic = "force-dynamic";

// 🔹 Obtener lista de razas activas
export async function GET() {
  try {
    const query = `
      SELECT 
        r.id_raza AS id,
        r.des_raza AS name,
        r.des_raza AS Nombre,
        r.flg_activo AS active
      FROM raza r
      WHERE r.flg_activo = 1
      ORDER BY r.id_raza ASC
    `;

    console.log("📥 Executing GET razas:", query);
    const [rows] = await pool.query(query);

    if (!Array.isArray(rows) || rows.length === 0) {
      console.warn("⚠️ No se encontraron razas activas.");
    }

    return NextResponse.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener las razas:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// 🔹 Insertar una nueva raza
export async function POST(req: Request) {
  try {
    const { name, active } = await req.json();
    console.log("📤 POST raza recibida:", { name, active });

    if (!name || typeof active !== "boolean") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const query = `INSERT INTO raza (des_raza, flg_activo) VALUES (?, ?)`;
    await pool.query(query, [name, active ? 1 : 0]);

    return NextResponse.json({ message: "✅ Raza registrada con éxito" });
  } catch (error) {
    console.error("❌ Error al registrar raza:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// 🔹 Actualizar una raza existente
export async function PUT(req: Request) {
  try {
    const { id, name, active } = await req.json();
    console.log("📤 PUT raza recibida:", { id, name, active });

    if (!id || !name || typeof active !== "boolean") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const query = `
      UPDATE raza 
      SET des_raza = ?, flg_activo = ? 
      WHERE id_raza = ?
    `;

    const [result]: any = await pool.query(query, [name, active ? 1 : 0, id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Raza no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ message: "✅ Raza actualizada con éxito" });
  } catch (error) {
    console.error("❌ Error al actualizar raza:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
