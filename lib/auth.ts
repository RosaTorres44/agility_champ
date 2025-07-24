// 📁 lib/auth.ts
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { pool } from "@/data/db";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

// Extendemos el tipado de sesión y token
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
      isNew?: boolean;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    nombre?: string;
    apellidos?: string;
    role?: string;
    isNew?: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials ?? {};
        if (!email || !password) return null;

        try {
          const query = `
            SELECT 
              id_persona AS id,
              des_nombres AS nombre,
              des_apellidos AS apellidos,
              des_rol AS role,
              hash_password,
              flg_activo
            FROM persona
            WHERE des_correo = ?
          `;
          const [rows]: any = await pool.query(query, [email]);

          if (!rows.length) return null;
          const user = rows[0];

          if (user.flg_activo === 0) return null;
          if (user.hash_password !== password) return null;

          return {
            id: user.id.toString(),
            nombre: user.nombre,
            apellidos: user.apellidos,
            email,
            role: user.role,
            isNew: false,
          };
        } catch (err) {
          console.error("❌ Error en login con credenciales:", err);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user?.email) {
    
        const query = `
          SELECT 
            id_persona AS id,
            des_nombres AS nombre,
            des_apellidos AS apellidos,
            des_rol AS role,
            flg_activo
          FROM persona
          WHERE des_correo = ?
        `;
        const [rows]: any = await pool.query(query, [user.email]);

        if (!rows.length) {
          const insertQuery = `
            INSERT INTO persona (des_nombres, des_apellidos, des_correo, des_rol, flg_activo)
            VALUES (?, ?, ?, 'Usuario', 1)
          `;
          const [result]: any = await pool.query(insertQuery, [user.name, "", user.email]);
          const newUserId = result.insertId;

          Object.assign(user, {
            id: newUserId,
            nombre: user.name || "",
            apellidos: "",
            role: "Usuario",
            isNew: true,
          });

          return true;
        }

        const persona = rows[0];
        if (persona.flg_activo === 0) return false;

        Object.assign(user, {
          id: persona.id,
          nombre: persona.nombre,
          apellidos: persona.apellidos,
          role: persona.role,
          isNew: false,
        });
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.nombre = (user as any).nombre;
        token.apellidos = (user as any).apellidos;
        token.role = (user as any).role;
        token.isNew = (user as any).isNew ?? false;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.nombre = token.nombre;
        session.user.apellidos = token.apellidos;
        session.user.role = token.role;
        session.user.isNew = token.isNew;
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
