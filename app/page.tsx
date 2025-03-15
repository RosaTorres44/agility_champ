"use client";

import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Rankings } from "@/components/rankings";
import { Competitions } from "@/components/competitions";  
import { Pie } from "@/components/Pie";

export default function Home() {
  return (
    <main className="min-h-screen bg-white overflow-auto"> 
      <Nav className="block sm:block md:block lg:block" />
      <Hero />  
      <Rankings filter="active" /> 
      <Competitions filter="active" />   
      <Pie />
    </main>
  );
}
