import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminMaestroTabla } from "@/components/admin-maestro-table";

// Definir el tipo de `escuelas`
interface Escuela {
  id: number;
  name: string;
  active: boolean;
}

// Definir el tipo de las acciones de `dispatch`
type AdminAction =
  | { type: "EDIT_USER"; payload: Escuela }
  | { type: "NEW_USER" }
  | { type: "CLOSE_FORM" };

// Definir las props del componente
interface AdminTableSectionProps {
  escuelas: Escuela[];
  dispatch: React.Dispatch<AdminAction>;
}

export function AdminTableSection({ escuelas, dispatch }: AdminTableSectionProps) {
  return (
    <Tabs defaultValue="actives" className="space-y-4">
      <TabsList className="bg-transparent border-b border-[#E5E7EB] w-full justify-start h-auto p-0 space-x-6">
        <TabsTrigger value="actives">Activas</TabsTrigger>
        <TabsTrigger value="inactives">Inactivas</TabsTrigger>
      </TabsList>
      {["actives", "inactives"].map((status) => {
        const isActive = status === "actives";
        return (
          <TabsContent key={status} value={status}>
            <AdminMaestroTabla
              users={escuelas.filter(e => e.active === isActive)}
              onEdit={(user) => dispatch({ type: "EDIT_USER", payload: user })}
            />
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
