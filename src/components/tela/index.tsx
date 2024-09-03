import Head from "next/head"
import { ReactNode } from "react"
import TituloHead from "../tituloHead"
import TituloTela from "../tituloTela"

interface TelaProps {

    tituloHead: string
    tituloTela: string
    col?: boolean
    children: ReactNode

}

export default function Tela(props: TelaProps) {

    let className = 'flex justify-center items-center p-10'

    if (props.col) className = className + ' flex-col'

    return (

        <main className={className}>

            <TituloHead>{props.tituloHead}</TituloHead>

            <TituloTela>{props.tituloTela}</TituloTela>
            
            <hr className="border border-border my-10
            w-4/12 md:w-3/12 lg:w-2/12"/>

            {props.children}

        </main>

    )

}