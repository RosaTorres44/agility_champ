
import { Filtros  } from './filtros';
import { TablaRankingOri  } from './tablaranking';


export function Rankings() {
  return (
    <section className="py-12 px-6 sm:px-12">
      <h2 className="text-2xl font-bold text-center">Rankings</h2>
      <p className="text-center text-muted-foreground mt-2">
        Revisa los rankings de la última competencia
      </p>
      <Filtros /> 
      <TablaRankingOri /> 
    </section>
  );
}