import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminMaestroTabla } from "@/components/admin-maestro-table";

interface Entidad {
  id: number;
  name: string;
  active: boolean;
}

// 🔹 Definir el tipo de acción que `dispatch` puede recibir
type AdminAction =
  | { type: "EDIT_ENTITY"; payload: Entidad }
  | { type: "NEW_ENTITY" }
  | { type: "CLOSE_FORM" };

interface AdminTableSectionProps {
  entityType: string;
  entities: Entidad[];
  dispatch: React.Dispatch<AdminAction>; // ✅ Ahora `dispatch` tiene el tipo correcto
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
