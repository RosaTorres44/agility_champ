import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminMaestroTabla } from "@/components/admin-maestro-table";

interface Entidad {
  id: number;
  name: string;
  active: boolean;
}

interface AdminTableSectionProps {
  entidades: Entidad[];
  dispatch: React.Dispatch<{ type: "EDIT_ENTITY"; payload: Entidad }>;
}

export function AdminTableSection({ entidades, dispatch }: AdminTableSectionProps) {
  return (
    <Tabs defaultValue="actives" className="space-y-4">
      <TabsList className="bg-transparent border-b border-[#E5E7EB] w-full justify-start h-auto p-0 space-x-6">
        <TabsTrigger value="actives">Activas</TabsTrigger>
        <TabsTrigger value="inactives">Inactivas</TabsTrigger>
      </TabsList>
      {["actives", "inactives"].map((status) => (
        <TabsContent key={status} value={status}>
          <AdminMaestroTabla
            users={entidades.filter(e => e.active === (status === "actives"))}
            onEdit={(user) => dispatch({ type: "EDIT_ENTITY", payload: user })}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
