import { Header_nav } from '@/components/header_nav'
import { Nav } from '@/components/nav'
import { Total_Competitions } from '@/components/total_competitions'
import { Registration } from '@/components/registration'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Nav />
      <Header_nav />
      <Total_Competitions />
      <Registration />
      <Footer />
    </main>
  )
}

