// 📁 app/api/personas/route.ts
import { NextResponse } from "next/server";
import { pool } from "@/data/db";
export const dynamic = "force-dynamic";

// 🔹 Obtener todas las personas

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const flg_activo = searchParams.get("flg_activo") || "1";

    const query = `
        SELECT 
        p.id_persona AS id,
        p.des_nombres AS Nombre,
        p.des_apellidos AS Apellidos,
        p.fec_nacimiento,
        p.flg_sexo,
        p.des_correo AS email,
        p.des_rol AS role,
        p.flg_activo AS active
      FROM agilitychamp.persona p 
    `;

    const [rows] = await pool.query(query, [flg_activo]);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}


// 🔹 Insertar una nueva persona
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📥 Datos recibidos en POST:", body);

    const { name, lastname, birthdate, flg_sexo, email, role, active } = body;

    if (!name || !lastname || !email || typeof active !== "boolean") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const query = `
      INSERT INTO agilitychamp.persona (
        des_nombres,
        des_apellidos,
        fec_nacimiento,
        flg_sexo,
        des_correo,
        des_rol,
        flg_activo
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.query(query, [
      name,
      lastname,
      birthdate,
      flg_sexo,
      email,
      role,
      active ? 1 : 0,
    ]);

    return NextResponse.json({ message: "Persona registrada con éxito" });
  } catch (error) {
    console.error("❌ Error al insertar persona:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// 🔹 Actualizar una persona existente
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, lastname, birthdate, flg_sexo, email, role, active } = body;

    if (!id || !name || !lastname || !email || typeof active !== "boolean") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const query = `
      UPDATE agilitychamp.persona
      SET 
        des_nombres = ?,
        des_apellidos = ?,
        fec_nacimiento = ?,
        flg_sexo = ?,
        des_correo = ?,
        des_rol = ?,
        flg_activo = ?
      WHERE id_persona = ?
    `;

    const [result]: any = await pool.query(query, [
      name,
      lastname,
      birthdate,
      flg_sexo,
      email,
      role,
      active ? 1 : 0,
      id
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Persona no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ message: "Persona actualizada con éxito" });
  } catch (error) {
    console.error("❌ Error al actualizar persona:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
