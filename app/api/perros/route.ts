
import { NextResponse } from "next/server";
import { pool } from "@/data/db";
export const dynamic = "force-dynamic";

// 🔹 Obtener todas las perros

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const flg_activo = searchParams.get("flg_activo") || "1";

    const query = `
  SELECT 
        p.id_perro AS id,
        p.des_nombres AS nombre,
        p.fec_nacimiento AS fec_nacimiento,
        p.flg_sexo AS sexo,
        p.des_chip AS chip,
        p.id_raza AS id_raza,
        r.des_raza AS raza,
        p.flg_activo AS flg_activo
      FROM perro p
      INNER JOIN raza r 
      ON p.id_raza = r.id_raza
      WHERE r.flg_activo = 1

    `;

    const [rows] = await pool.query(query, [flg_activo]);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error al obtener las categorías:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
 
// 🔹 Insertar un nuevo perro
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Datos recibidos en POST:", body);

    const {
      nombre,
      fec_nacimiento,
      sexo,
      chip,
      id_raza,
      flg_activo,
    } = body;

    // Validación simple
    if (
      !nombre ||
      !fec_nacimiento ||
      (sexo !== 0 && sexo !== 1) ||
      !chip ||
      !id_raza ||
      typeof flg_activo !== "boolean"
    ) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const query = `
      INSERT INTO perro (
        des_nombres, fec_nacimiento, flg_sexo, des_chip, id_raza, flg_activo
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;

    await pool.query(query, [
      nombre,
      fec_nacimiento,
      parseInt(sexo),
      chip,
      parseInt(id_raza),
      flg_activo ? 1 : 0,
    ]);

    return NextResponse.json({ message: "Perro registrado con éxito" });
  } catch (error) {
    console.error("Error al insertar perro:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
// 🔹 Actualizar un perro existente
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    console.log("📥 Datos recibidos en PUT:", body);

    const {
      id,
      nombre,
      fec_nacimiento,
      sexo,
      chip,
      id_raza,
      flg_activo,
    } = body;

    if (
      !id ||
      !nombre ||
      !fec_nacimiento ||
      (sexo !== 0 && sexo !== 1) ||
      !chip ||
      !id_raza ||
      typeof flg_activo !== "boolean"
    ) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

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

    await pool.query(query, [
      nombre,
      fec_nacimiento,
      parseInt(sexo),
      chip,
      parseInt(id_raza),
      flg_activo ? 1 : 0,
      id,
    ]);

    return NextResponse.json({ message: "🐶 Perro actualizado con éxito" });
  } catch (error) {
    console.error("❌ Error al actualizar perro:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
