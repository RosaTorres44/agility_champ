import Image from 'next/image'

export function Header_nav() {
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
        Las Competencias
      </h1>
      </div>
    </div>
  )
}

