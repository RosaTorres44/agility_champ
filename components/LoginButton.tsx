"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface Props {
  onLoginClick?: () => void;
}

export function LoginButton({ onLoginClick }: Props) {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700">Hola, {session.user?.name}</span>
        <Button
          variant="outline"
          className="text-red-600 border-red-600 px-3 py-1 text-xs hover:bg-red-50 hover:text-red-800"
          onClick={() => signOut()}
        >
          Cerrar sesión
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={() => {
        signIn();
        onLoginClick?.();
      }}
      className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-md"
    >
      Iniciar sesión
    </Button>
  );
}
