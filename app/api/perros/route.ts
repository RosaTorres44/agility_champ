import { NextResponse } from "next/server";
import { pool } from "@/data/db";
export const dynamic = "force-dynamic";

// 🔹 Obtener todos los perros
export async function GET() {
  try {
    const query = `
      SELECT 
        p.id_perro AS id,
        p.des_nombres AS Nombre,
        p.fec_nacimiento AS fec_nacimiento,
        p.flg_sexo AS sexo,
        p.des_chip AS chip,
        p.id_raza AS id_raza,
        r.des_raza AS raza,
        p.flg_activo AS active
      FROM perro p
      INNER JOIN raza r ON p.id_raza = r.id_raza
      WHERE r.flg_activo = 1
    `;
    const [rows] = await pool.query(query);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error al obtener perros:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// 🔹 Insertar un nuevo perro
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Datos recibidos en POST:", body);

    const {
      Nombre,
      fec_nacimiento,
      sexo,
      chip,
      id_raza,
      active,
    } = body;

    // Validación simple
    if (
      !Nombre ||
      !fec_nacimiento ||
      (sexo !== 0 && sexo !== 1) ||
      !chip ||
      !id_raza ||
      typeof active !== "boolean"
    ) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const query = `
      INSERT INTO perro (
        des_nombres, fec_nacimiento, flg_sexo, des_chip, id_raza, flg_activo
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;

    await pool.query(query, [
      Nombre,
      fec_nacimiento,
      parseInt(sexo),
      chip,
      parseInt(id_raza),
      active ? 1 : 0,
    ]);

    return NextResponse.json({ message: "Perro registrado con éxito" });
  } catch (error) {
    console.error("Error al insertar perro:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
