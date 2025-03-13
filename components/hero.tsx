import Image from 'next/image'

export function Hero() {
  return (
    <div className="relative h-[400px] w-full">
      <Image
      src="/cabecera.jpeg"
      alt="imagen de cabecera"
      width={1200}
      height={400}
      className="object-cover w-full h-full"
      priority
      />
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12">
      <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">
        Conectando corazones
      </h1>
      <p className="mt-4 text-lg text-white/90">a través del deporte canino</p>
      </div>
    </div>
  )
}

