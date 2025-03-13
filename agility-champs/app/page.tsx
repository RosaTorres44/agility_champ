import { Hero } from '@/components/hero'
import { Nav } from '@/components/nav'
import { Rankings } from '@/components/rankings'
import { Competitions } from '@/components/competitions' 
import { Registration } from '@/components/registration'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Nav />
      <Hero />
      <Rankings />
      <Competitions filter="active" /> 
      <Registration />
      <Footer />
    </main>
  )
}

