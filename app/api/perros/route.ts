import { NextResponse } from "next/server";
import { pool } from "@/data/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const query = `
      SELECT 
        p.id_perro AS id,
        p.des_nombres AS Name,
        p.fec_nacimiento AS fecha_nacimiento,
        p.flg_sexo AS sexo,
        p.des_chip AS chip,
        p.id_raza AS id_raza,
        r.des_raza AS raza,
        p.flg_activo AS active
      FROM perro p
      INNER JOIN raza r ON p.id_raza = r.id_raza
      WHERE  r.flg_activo = 1;
    `;

    const [rows] = await pool.query(query);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener perros:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { Name, fecha_nacimiento, sexo, chip, id_raza, active } = await req.json();

    const query = `
      INSERT INTO perro (
        des_nombres, fec_nacimiento, flg_sexo, des_chip, id_raza, flg_activo
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;

    await pool.query(query, [Name, fecha_nacimiento, sexo, chip, id_raza, active]);

    return NextResponse.json({ message: "🐶 Perro registrado con éxito" });
  } catch (error) {
    console.error("❌ Error al registrar perro:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, Name, fecha_nacimiento, sexo, chip, id_raza, active } = await req.json();

    const query = `
      UPDATE perro
      SET
        des_nombres = ?,
        fec_nacimiento = ?,
        flg_sexo = ?,
        des_chip = ?,
        id_raza = ?,
        flg_activo = ?
      WHERE id_perro = ?
    `;

    const [result]: any = await pool.query(query, [
      Name,
      fecha_nacimiento,
      sexo,
      chip,
      id_raza,
      active,
      id,
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Perro no encontrado" }, { status: 404 });
    }

    return NextResponse.json({ message: "🐶 Perro actualizado con éxito" });
  } catch (error) {
    console.error("❌ Error al actualizar perro:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
