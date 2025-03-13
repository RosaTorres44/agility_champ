import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'

export function Pie() {
  return (
    <section className="bg-gray-900 text-gray-100 py-12 px-6">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center items-center">
      
      {/* LOGO MÁS GRANDE */}
      <div className="flex flex-col items-center">
        <Image
          src="/logo.jpeg"
          alt="Agility Champs Logo"
          width={200} // Aumentado para mayor visibilidad
          height={200} 
          className="w-48 h-48 mb-4" // Ajustado para hacer más grande
        />
      </div>




      {/* REGISTRO */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-white">Registrate</h3>
        <div className="flex flex-col gap-4">
          <p className="mb-4 text-indigo-100">
            Únete a nuestra comunidad y mantente actualizado sobre las competencias.
          </p>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            Registrarte
          </Button>
        </div>
      </div>

      {/* SUSCRIPCIÓN */}
      <div className="bg-gray-800 p-8 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-white">Suscríbete y entérate de las novedades</h3>
        <div className="flex flex-col gap-4">
          <Input
            type="email"
            placeholder="Ingresa tu correo"
            className="bg-gray-700 border-gray-600 text-white p-3"
          />
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            Subscribe
          </Button>
        </div>
      </div>

    </div>

    {/* FOOTER */}
    <div className="mt-12 border-t border-gray-800 pt-8 text-sm text-gray-400 text-center">
      <p>&copy; 2024 Agility Champs, Inc. • Privacy • Terms • Sitemap</p>
      <div className="flex justify-center gap-4 mt-4">
        <a href="#" className="hover:text-white">Twitter</a>
        <a href="#" className="hover:text-white">Facebook</a>
        <a href="#" className="hover:text-white">LinkedIn</a>
        <a href="#" className="hover:text-white">YouTube</a>
      </div>
    </div>

  </section>
  )
}

