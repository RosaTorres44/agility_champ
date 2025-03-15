"use client";

import { Header_nav } from "@/components/header_nav";
import { Nav } from "@/components/nav";
import { Admin } from "@/components/admin";
import { Pie } from "@/components/Pie";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-white">
      <Nav />
      <Header_nav title="Administrar" />
      <Suspense fallback={<div>Cargando...</div>}>
        <Admin />
      </Suspense>
      <Pie />
    </main>
  );
}
