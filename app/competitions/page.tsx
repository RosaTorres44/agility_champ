import { Header_nav } from '@/components/header_nav'
import { Nav } from '@/components/nav'
import { Competitions } from '@/components/competitions' 
import { Pie } from '@/components/Pie'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Nav />
      <Header_nav title="Mis Competencias" /> 
      <Competitions filter="all" /> 
      <Pie />
    </main>
  )
}

