import { Hero } from '@/components/hero'
import { Nav } from '@/components/nav'
import { Rankings } from '@/components/rankings'
import { Competitions } from '@/components/competitions'  
import { Pie } from '@/components/Pie'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Nav />
      <Hero />
      <Rankings filter="active" />
      <Competitions filter="active" />  
      <Pie />
    </main>
  )
}

