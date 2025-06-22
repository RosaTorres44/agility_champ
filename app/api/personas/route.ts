import { NextResponse } from "next/server";
import { pool } from "@/data/db";

export const dynamic = "force-dynamic";

// GET - Listar personas
export async function GET() {
  try {
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
      FROM agilitychamp.persona p;
    `;

    const [rows] = await pool.query(query);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error al obtener lista de personas:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// POST - Crear nueva persona
export async function POST(req: Request) {
  try {
    const { name, lastname, birthdate, sexo, email, role, active } = await req.json();

    if (!name || !lastname || !birthdate || sexo === undefined || !email || !role) {
      return NextResponse.json({ error: "Campos obligatorios faltantes" }, { status: 400 });
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
      parseInt(sexo),
      email,
      role,
      active ? 1 : 0,
    ]);

    return NextResponse.json({ message: "Persona creada exitosamente" });
  } catch (error) {
    console.error("Error al crear persona:", error);
    return NextResponse.json({ error: "Error al crear persona" }, { status: 500 });
  }
}

// PUT - Actualizar persona
export async function PUT(req: Request) {
  try {
    const { id, name, lastname, birthdate, sexo, email, role, active } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "ID requerido para actualizar" }, { status: 400 });
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

    await pool.query(query, [
      name,
      lastname,
      birthdate,
      parseInt(sexo),
      email,
      role,
      active ? 1 : 0,
      id,
    ]);

    return NextResponse.json({ message: "Persona actualizada exitosamente" });
  } catch (error) {
    console.error("Error al actualizar persona:", error);
    return NextResponse.json({ error: "Error al actualizar persona" }, { status: 500 });
  }
}

