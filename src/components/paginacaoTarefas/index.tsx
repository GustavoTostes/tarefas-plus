import Button from "../ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginacaoTarefasProps {

    totalTarefas: number,
    paginaAtual: number,
    setPagina: (pagina: number) => void

}

export default function PaginacaoTarefas(props: PaginacaoTarefasProps) {

    let paginas = []

    const tarefasPorPagina = 4

    for (let i = 1; i <= Math.ceil(props.totalTarefas / tarefasPorPagina); i++) {

        paginas.push(i)

    }

    return (

        <div className="flex justify-center items-center space-x-3">

            <Button 
            variant="ghost" 
            animated
            onClick={() => props.setPagina(

                props.paginaAtual == 1
                ? paginas[paginas.length - 1]
                : props.paginaAtual - 1

            )}>

                <ChevronLeft/>

            </Button>

            {

                paginas.map(pagina => (

                    <Button 
                    onClick={() => props.setPagina(pagina)}
                    variant={

                        props.paginaAtual == pagina
                        ? 'foreground'
                        : 'ghost'

                    }
                    animated>{pagina}</Button>

                ))

            }

            <Button 
            variant="ghost" 
            animated
            onClick={() => props.setPagina(

                props.paginaAtual == paginas[paginas.length - 1]
                ? 1
                : props.paginaAtual + 1

            )}>

                <ChevronRight/>

            </Button>

        </div>

    )

}