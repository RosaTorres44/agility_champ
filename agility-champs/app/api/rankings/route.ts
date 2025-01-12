import { NextResponse } from "next/server";
import { pool } from "@/data/db";

export async function GET() {
  try {
    const query = `
      SELECT 
        d.NombrePerro AS dogName, 
        u.Nombre AS handlerName, 
        g.Nombre AS grado, 
        c.Nombre AS categoria, 
        r.Posicion as rating, 
        d.FotoURL AS image 
      FROM Usuarios u 
      INNER JOIN Duplas d ON u.UsuarioID = d.UsuarioID  
      INNER JOIN Grados g ON g.GradoID = d.GradoID  
      INNER JOIN Categorias c ON c.CategoriaID = d.CategoriaID  
      INNER JOIN Resultados r ON r.DuplaID = d.DuplaID  
      ORDER BY r.Posicion ASC
    `;

    console.log("Executing query:", query); // Depuración

    const [rows] = await pool.query(query);

    if (!Array.isArray(rows) || rows.length === 0) {
      console.warn("No se encontraron resultados en la base de datos.");
    }

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error al obtener el ranking:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
