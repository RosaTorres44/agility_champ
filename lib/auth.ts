import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";
import { pool } from "@/data/db";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      nombre?: string;
      apellidos?: string;
      role?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        const email = user.email;
        console.log("📧 Intentando login con:", email);

        const queryBuscar = `
          SELECT 
            id_persona AS id,
            des_nombres AS nombre,
            des_apellidos AS apellidos,
            des_rol AS role,
            flg_activo
          FROM persona
          WHERE des_correo = ?
        `;
        const [rows]: any = await pool.query(queryBuscar, [email]);

        if (rows.length > 0) {
          const persona = rows[0];

          if (persona.flg_activo === 0) {
            console.log("🔒 Usuario inactivo:", email);
            return false;
          }

          console.log(`✅ Usuario encontrado: ${persona.nombre} ${persona.apellidos} (${persona.role})`);

          // Agregar campos al objeto user
          (user as any).id = persona.id;
          (user as any).nombre = persona.nombre;
          (user as any).apellidos = persona.apellidos;
          (user as any).role = persona.role;
          return true;
        } else {
          // 👤 Insertar nuevo usuario como "Usuario"
          const nombre = user.name?.split(" ")[0] || "";
          const apellidos = user.name?.split(" ").slice(1).join(" ") || "";

          const insertQuery = `
            INSERT INTO persona (des_nombres, des_apellidos, des_correo, des_rol, flg_activo)
            VALUES (?, ?, ?, 'Usuario', 1)
          `;
          const [result]: any = await pool.query(insertQuery, [
            nombre,
            apellidos,
            email,
          ]);

          console.log(`🆕 Usuario nuevo registrado como Usuario: ${nombre} ${apellidos} (${email})`);

          (user as any).id = result.insertId;
          (user as any).nombre = nombre;
          (user as any).apellidos = apellidos;
          (user as any).role = "Usuario";
          return true;
        }
      } catch (error) {
        console.error("❌ Error en signIn callback:", error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.nombre = (user as any).nombre;
        token.apellidos = (user as any).apellidos;
        token.role = (user as any).role || "Usuario";
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.nombre = token.nombre as string;
        session.user.apellidos = token.apellidos as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
