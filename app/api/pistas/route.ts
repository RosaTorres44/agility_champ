import { NextResponse } from "next/server";
import { pool } from "@/data/db";

export const dynamic = "force-dynamic";

// 🔹 GET - Listar pistas (con filtro opcional por competencia_id)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const competenciaId = searchParams.get("competencia_id");

    let query = `
      SELECT 
        p.id_pista,
        p.des_pista as Nombre, 
        p.id_competencia,
        c.des_competencia AS competencia,
        p.id_grado,
        g.des_grado AS grado,
        p.id_categoria,
        cat.des_categoria AS categoria,
        p.id_persona,
        per.des_nombres AS juez,
        p.num_obstaculos,
        p.num_longitud,
        p.num_velocidad_maxima,
        p.num_velocidad_minima,
        p.num_tiempo_maximo,
        p.num_tiempo_minimo,
        p.des_tipo,
        p.flg_activo AS active,
        p.fec_creacion
      FROM pista p
      LEFT JOIN competencia c ON p.id_competencia = c.id_competencia
      LEFT JOIN grado g ON p.id_grado = g.id_grado
      LEFT JOIN categoria cat ON p.id_categoria = cat.id_categoria
      LEFT JOIN persona per ON p.id_persona = per.id_persona
    `;

    const params: any[] = [];

    if (competenciaId) {
      query += " WHERE p.id_competencia = ?";
      params.push(competenciaId);
    }

    query += " ORDER BY p.id_pista DESC";

    const [rows] = await pool.query(query, params);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("❌ Error al obtener las pistas:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// 🔹 POST - Crear pista
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const query = `
      INSERT INTO pista (
        des_pista,
        id_competencia,
        id_grado,
        id_categoria,
        id_persona,
        num_obstaculos,
        num_longitud,
        num_velocidad_maxima,
        num_velocidad_minima,
        num_tiempo_maximo,
        num_tiempo_minimo,
        des_tipo,
        flg_activo,
        fec_creacion
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    const values = [
      body.des_pista,
      parseInt(body.id_competencia),
      parseInt(body.id_grado),
      parseInt(body.id_categoria),
      parseInt(body.id_persona),
      parseInt(body.num_obstaculos),
      parseFloat(body.num_longitud),
      parseFloat(body.num_velocidad_maxima),
      parseFloat(body.num_velocidad_minima),
      parseFloat(body.num_tiempo_maximo),
      parseFloat(body.num_tiempo_minimo),
      body.des_tipo,
      body.active ? 1 : 0,
    ];

    const result: any = await pool.query(query, values);
    return NextResponse.json({ message: "Pista creada correctamente", id: result.insertId });
  } catch (error) {
    console.error("❌ Error al crear la pista:", error);
    return NextResponse.json({ error: "Error al crear la pista" }, { status: 500 });
  }
}

// 🔹 PUT - Actualizar pista existente
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    if (!body.id) {
      return NextResponse.json({ error: "ID de pista requerido" }, { status: 400 });
    }

    const query = `
      UPDATE pista SET
        des_pista = ?,
        id_competencia = ?,
        id_grado = ?,
        id_categoria = ?,
        id_persona = ?,
        num_obstaculos = ?,
        num_longitud = ?,
        num_velocidad_maxima = ?,
        num_velocidad_minima = ?,
        num_tiempo_maximo = ?,
        num_tiempo_minimo = ?,
        des_tipo = ?,
        flg_activo = ?
      WHERE id_pista = ?
    `;

    const values = [
      body.des_pista,
      parseInt(body.id_competencia),
      parseInt(body.id_grado),
      parseInt(body.id_categoria),
      parseInt(body.id_persona),
      parseInt(body.num_obstaculos),
      parseFloat(body.num_longitud),
      parseFloat(body.num_velocidad_maxima),
      parseFloat(body.num_velocidad_minima),
      parseFloat(body.num_tiempo_maximo),
      parseFloat(body.num_tiempo_minimo),
      body.des_tipo,
      body.active ? 1 : 0,
      parseInt(body.id),
    ];

    await pool.query(query, values);
    return NextResponse.json({ message: "Pista actualizada correctamente" });
  } catch (error) {
    console.error("❌ Error al actualizar la pista:", error);
    return NextResponse.json({ error: "Error al actualizar la pista" }, { status: 500 });
  }
}
