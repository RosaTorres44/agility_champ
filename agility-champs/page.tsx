import { Hero } from './components/hero'
import { Rankings } from './components/rankings'
import { UpcomingCompetitions } from './components/upcoming-competitions'
import { Registration } from './components/registration'
import { Footer } from './components/footer'

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Rankings />
      <UpcomingCompetitions />
      <Registration />
      <Footer />
    </div>
  )
}

