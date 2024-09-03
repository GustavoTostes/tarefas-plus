interface CardComentarioProps {

    autorComentario: string
    comentario: string

}

export default function CardComentario(props: CardComentarioProps) {

    return (

        <div className="bg-foreground rounded-md flex justify-center items-start 
        p-2 pr-3 flex-col space-y-4 w-full">

            <span className="text-xs bg-primary py-0.5 px-2 rounded text-background font-semibold
            uppercase">
            
                {props.autorComentario}
            
            </span>

            <h1 className="ml-1 break-words text-sm">{props.comentario}</h1>

        </div>

    )

}