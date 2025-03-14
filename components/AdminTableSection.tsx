import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminMaestroTabla } from "@/components/admin-maestro-table";

interface Entidad {
  id: number;
  active: boolean;
  [key: string]: any; // 🔹 Permite cualquier otra propiedad sin romper el tipado
}

interface AdminTableSectionProps {
  entityType: string;
  entities: Entidad[];
  dispatch: React.Dispatch<{ type: "EDIT_ENTITY"; payload: Entidad }>;
}

export function AdminTableSection({ entityType, entities, dispatch }: AdminTableSectionProps) {
  return (
    <Tabs defaultValue="actives" className="space-y-4">
      <TabsList className="bg-transparent border-b border-[#E5E7EB] w-full justify-start h-auto p-0 space-x-6">
        <TabsTrigger value="actives">Activas</TabsTrigger>
        <TabsTrigger value="inactives">Inactivas</TabsTrigger>
      </TabsList>
      {["actives", "inactives"].map((status) => (
        <TabsContent key={status} value={status}>
          <AdminMaestroTabla
            entityType={entityType}  
            entities={entities.filter(e => e.active === (status === "actives"))}
            onEdit={(entity) => dispatch({ type: "EDIT_ENTITY", payload: entity })}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
