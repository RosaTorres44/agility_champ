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
 
      <div className="flex flex-col flex-wrap gap-6 px-4 sm:px-6 md:px-8 lg:px-12"> 
        <Hero />  
        <Rankings filter="active" /> 
        <Competitions filter="active" />   
      </div> 
      <Pie />
    </main>
  );
}
