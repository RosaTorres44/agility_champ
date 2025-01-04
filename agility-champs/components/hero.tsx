import Image from 'next/image'

export function Hero() {
  return (
    <div className="relative h-[600px] w-full">
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Agility%20Champs%20-%20Competitions%20Overview.jpg-uZhWSl8JkBjxDQotaxcjAb4Qeoh7YE.jpeg"
        alt="White poodle jumping through agility course obstacle"
        width={1200}
        height={600}
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

