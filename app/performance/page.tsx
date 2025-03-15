"use client";

import { Header_nav } from "@/components/header_nav";
import { Nav } from "@/components/nav";
import { Performance } from "@/components/performance";
import { Pie } from "@/components/Pie";

export const dynamic = "force-dynamic";

export default function PerformancePage() {
  return (
    <main className="min-h-screen bg-white">
      <Nav />
      <Header_nav title="Mis Resultados" />
      <Performance />
      <Pie />
    </main>
  );
}
