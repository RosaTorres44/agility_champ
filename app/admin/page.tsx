import { UsersTable } from "@/components/users-table"
import { UserForm } from "@/components/user-form"
import { Button } from "@/components/ui/button"
import { SidebarNav } from "@/components/sidebar-nav"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Nav } from '@/components/nav'
import { Header_nav } from '@/components/header_nav'
import { Pie } from '@/components/Pie'

const navigation = [
  {
    href: "/usuarios",
    title: "Usuarios",
    icon: "users",
  },
  {
    href: "/competencias",
    title: "Competencias",
    icon: "trophy",
  },
  {
    href: "/escuelas",
    title: "Escuelas",
    icon: "school",
  },
  {
    href: "/pistas",
    title: "Pistas",
    icon: "track",
  },
  {
    href: "/duplas",
    title: "Duplas",
    icon: "pairs",
  },
  // New dog-related sections
  {
    href: "/perros",
    title: "Perros",
    icon: "dog",
  },
  {
    href: "/razas",
    title: "Razas",
    icon: "breeds",
  },
  {
    href: "/entrenamiento",
    title: "Entrenamiento",
    icon: "training",
  },
  {
    href: "/veterinarios",
    title: "Veterinarios",
    icon: "vet",
  },
  {
    href: "/alimentacion",
    title: "Alimentación",
    icon: "food",
  },
]

const users = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    role: "Admin",
    active: true,
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob.smith@example.com",
    role: "Editor",
    active: true,
  },
  {
    id: "3",
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    role: "Viewer",
    active: true,
  },
  {
    id: "4",
    name: "Diana Prince",
    email: "diana.prince@example.com",
    role: "Admin",
    active: true,
  },
  {
    id: "5",
    name: "Ethan Hunt",
    email: "ethan.hunt@example.com",
    role: "Editor",
    active: false,
  },
  {
    id: "6",
    name: "Fiona Green",
    email: "fiona.green@example.com",
    role: "Viewer",
    active: false,
  },
]


export default function UsersPage() {
  return (

     <main className="min-h-screen bg-white">
          <Nav />
          <Header_nav title="Administrar" /> 
          <div className="flex flex-col min-h-screen">

                <div className="hidden space-y-6 p-10 pb-16 md:block">
                  <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                    <aside className="-mx-4 lg:w-1/5">
                    <SidebarNav  />
                    </aside>
                    <div className="flex-1 lg:max-w-4xl">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <h1 className="text-2xl font-bold tracking-tight">Ususarios</h1>
                          <div className="relative h-10 w-10">
                            
                          </div>
                        </div>
                        <Button className="bg-[#6366F1] hover:bg-[#4F46E5]">Add New User</Button>
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
                          <TabsTrigger
                            value="inactive"
                            className="text-sm data-[state=active]:text-[#6366F1] data-[state=active]:border-[#6366F1] rounded-none border-b-2 border-transparent px-0 pb-4"
                          >
                            Inactive
                          </TabsTrigger>
                          <TabsTrigger
                            value="roles"
                            className="text-sm data-[state=active]:text-[#6366F1] data-[state=active]:border-[#6366F1] rounded-none border-b-2 border-transparent px-0 pb-4"
                          >
                            Roles
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="actives" className="space-y-6">
                          <UsersTable users={users} />
                          <div className="rounded-md border p-6 bg-[#F9FAFB]">
                            <h2 className="text-lg font-medium mb-4">Detalle</h2>
                            <UserForm />
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                </div>
                </div>

          <Pie />
        </main>


    
  )
}

