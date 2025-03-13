import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: process.env.DB_HOST, // Dirección del servidor
  user: process.env.DB_USER, // Usuario
  password: process.env.DB_PASSWORD, // Contraseña
  database: process.env.DB_NAME, // Nombre de la base de datos
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0,
});
