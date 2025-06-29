"use client";
import { useSearchParams } from "next/navigation";

const errorMessages: Record<string, string> = {
  OAuthCallback: "Hubo un problema al iniciar sesión con Google.",
  AccessDenied: "Acceso denegado.",
  Configuration: "Falta configuración. Verifica tu .env.",
  InvalidClient: "Credenciales inválidas.",
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const message = errorMessages[error ?? ""] || "Ocurrió un error desconocido.";

  return (
    <main className="min-h-screen flex items-center justify-center flex-col">
      <h1 className="text-2xl font-bold text-red-600">❌ Error de autenticación</h1>
      <p className="mt-4 text-center">{message}</p>
    </main>
  );
}
