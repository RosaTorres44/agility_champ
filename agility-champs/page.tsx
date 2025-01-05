import React from 'react'
import { Hero } from './components/hero'
import { Nav } from './components/nav'
import { Rankings } from './components/rankings'
import { UpcomingCompetitions } from './components/upcoming-competitions'
import { Registration } from './components/registration'
import { Footer } from './components/footer'

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <Hero />
      <Rankings />
      <UpcomingCompetitions />
      <Registration />
      <Footer />
    </div>
  )
}

