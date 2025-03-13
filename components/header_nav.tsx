import Image from 'next/image'

interface HeaderNavProps {
  title: string; // Definimos la prop para el título
}

export function Header_nav({ title }: HeaderNavProps) {
  return (
    <div className="relative h-[300px] w-full">
      <Image
        src="/cabecera_sec.jpeg"
        alt="imagen de cabecera"
        width={600}
        height={200}
        className="object-cover w-full h-full"
        priority
      />
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12">
        <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
          {title} {/* Texto dinámico */}
        </h1>
      </div>
    </div>
  )
}
