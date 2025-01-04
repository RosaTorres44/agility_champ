import { GradoButton, CategoriaButton } from './boton_opciones';


export function Filtros() {
    return (
        <div className="flex gap-4 justify-center my-8">
        <CategoriaButton />
        <GradoButton /> 
        </div>
    );

}