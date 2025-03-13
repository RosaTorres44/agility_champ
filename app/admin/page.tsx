"use client";

import { Suspense, useEffect, useState } from "react";
import { UsersTable } from "@/components/users-table";
import { UserForm } from "@/components/user-form";
import { SidebarNav } from "@/components/sidebar-nav";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Nav } from "@/components/nav";
import { Header_nav } from '@/components/header_nav';
import axios from "axios";
import { useSearchParams } from "next/navigation";

function SearchParamsWrapper() {
  const searchParams = useSearchParams();
  return searchParams.get("view") || "usuarios";
}

const navigation = [
  { href: "/admin?view=usuarios", title: "Usuarios", icon: "users" as const },
  { href: "/admin?view=competencias", title: "Competencias", icon: "trophy" as const },
];

export default function AdminPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <PageContent />
    </Suspense>
  );
}

function PageContent() {
  const view = SearchParamsWrapper();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endpoint = view === "competencias" ? "/api/competencias" : "/api/usuarios";
        const response = await axios.get(endpoint);
        setData(response.data);
      } catch (error) {
        console.error(`Error fetching ${view} data:`, error);
      }
    };

    fetchData();
  }, [view]);

  return (
    <main className="min-h-screen bg-white">
      <Nav />
      <Header_nav title="Administracion" />
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={navigation} />
          </aside>
          <div className="flex-1 lg:max-w-4xl">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold tracking-tight">
                {view === "competencias" ? "Competencias" : "Usuarios"}
              </h1>
              <Button className="bg-[#6366F1] hover:bg-[#4F46E5]">
                {view === "competencias" ? "Add New Competencia" : "Add New User"}
              </Button>
            </div>
            <Tabs defaultValue="actives" className="space-y-4">
              <TabsList className="bg-transparent border-b border-[#E5E7EB] w-full justify-start h-auto p-0 space-x-6">
                <TabsTrigger
                  value="actives"
                  className="text-sm data-[state=active]:text-[#6366F1] data-[state=active]:border-[#6366F1] rounded-none border-b-2 border-transparent px-0 pb-4"
                >
                  Actives
                </TabsTrigger>
                <TabsTrigger
                  value="inactives"
                  className="text-sm data-[state=active]:text-[#6366F1] data-[state=active]:border-[#6366F1] rounded-none border-b-2 border-transparent px-0 pb-4"
                >
                  Inactives
                </TabsTrigger>
              </TabsList>
              <TabsContent value="actives" className="space-y-6">
                {view === "competencias" ? (
                  <div>
                    <h2>Competencias</h2>
                  </div>
                ) : (
                  <UsersTable users={data} />
                )}
                <div className="rounded-md border p-6 bg-[#F9FAFB]">
                  <h2 className="text-lg font-medium mb-4">Detalle</h2>
                  <UserForm />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  );
}
