import { NextResponse } from "next/server";
import { pool } from "@/data/db";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT Nombre FROM Categorias order by CategoriaID asc");
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error al obtener las categorias:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
