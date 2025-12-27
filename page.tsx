import React from 'react'
import { Hero } from './components/hero'
import { Nav } from './components/nav'
import { Rankings } from './components/rankings'
import { Competitions } from './components/competitions' 
import { Pie } from './components/Pie'

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      <Nav />
      <Hero />
      <Rankings />
      <Competitions /> 
      <Pie />
    </div>
  )
}

