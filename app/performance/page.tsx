"use client"; 
import { Filtros_Duplas } from '@/components/filtros_dupla';
import { Header_nav } from '@/components/header_nav'
import { Nav } from '@/components/nav' 
import { Pie } from '@/components/Pie'
export const dynamic = "force-dynamic";


export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Nav />
      <Header_nav title="Mis Resultados" /> 
      <Filtros_Duplas /> 
      <Pie />
    </main>
  )
}




 