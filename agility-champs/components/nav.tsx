"use client"; // Esto fuerza que el componente sea renderizado en el cliente

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation'; // Importa usePathname

export function Nav() {
  const pathname = usePathname(); // Obtén la ruta actual

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            {/* Logo and brand */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8">
                <Image
                  src="/logo.jpeg"
                  alt="Agility Champs Logo"
                  width={32}
                  height={32}
                  className="w-8 h-8"
                />
              </div>
              <span className="font-semibold text-xl">Agility Champs</span>
            </Link>

            {/* Navigation tabs */}
            <div className="hidden sm:flex gap-1">
              <Link
                href="/"
                className={`px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 ${
                  pathname === '/' ? 'text-indigo-600' : 'text-gray-500'
                }`}
              >
                Explorar
              </Link>
              <Link
                href="/competitions"
                className={`px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 ${
                  pathname === '/competitions' ? 'text-indigo-600' : 'text-gray-500'
                }`}
              >
                Competencias
              </Link>
              <Link
                href="/performance"
                className={`px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 ${
                  pathname === '/performance' ? 'text-indigo-600' : 'text-gray-500'
                }`}
              >
                Mi Desempeño
              </Link>
              <Link
                href="/admin"
                className={`px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 ${
                  pathname === '/admin' ? 'text-indigo-600' : 'text-gray-500'
                }`}
              >
                Administrar
              </Link>
            </div>
          </div>

          {/* Login button */}
          <div>
            <Button
              variant="default"
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Ingresar
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
