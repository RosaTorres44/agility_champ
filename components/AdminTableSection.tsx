import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminMaestroTabla } from "@/components/admin-maestro-table";

// 🔹 Tipo de acción flexible
type AdminAction =
  | { type: "EDIT_ENTITY"; payload: any }
  | { type: "NEW_ENTITY" }
  | { type: "CLOSE_FORM" };

interface AdminTableSectionProps {
  entityType: string;
  entities: any[];
  dispatch: React.Dispatch<AdminAction>;
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
            entities={entities.filter((e) => e.active === (status === "actives"))}
            onEdit={(entity) => dispatch({ type: "EDIT_ENTITY", payload: entity })}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
