import db from '@/services/firebaseConnection'
import { collection, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { Trash, Eye, Lock, Share2, MessageCircle } from 'lucide-react'
import { useRouter } from 'next/router'
import { ButtonHTMLAttributes, ReactNode } from 'react'

export interface CardTarefaProps {

    id: string
    nomeTarefa: string
    tarefaPublica: boolean
    showAlert: (texto: string) => void

}

export default function CardTarefa(props: CardTarefaProps) {

    const router = useRouter()
    
    function copiarLinkTarefa(idTarefa: string) {

        navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_URL}/tarefa/${idTarefa}`)
        props.showAlert('Link copiado com sucesso!')

    }

    async function deletarTarefa(idTarefa: string) {

        const tarefasRef = doc(db, 'tarefas', idTarefa)
        await deleteDoc(tarefasRef)

        // -----------------------------------

        const comentariosRef = collection(db, 'comentarios')
        const consultaComentarios = query(

            comentariosRef,
            where('idTarefa', '==', idTarefa)

        )

        const idsComentarios = await getDocs(consultaComentarios)

        for (const item of idsComentarios.docs) {
            
            const comentarioRef = doc(db, 'comentarios', item.id)
            await deleteDoc(comentarioRef)

        }

    }

    return (

        <div className="w-full bg-foreground rounded-md flex justify-start items-center 
        p-3 pr-2 space-x-5 overflow-auto">

            <div className="flex justify-start items-start flex-col space-y-4 w-full">

                {

                    props.tarefaPublica

                    ? 

                    <EtiquetaTarefa>

                        <span>pública</span>
                        <Eye size={14}/>

                    </EtiquetaTarefa>

                    : 

                    <EtiquetaTarefa>

                        <span>privada</span>
                        <Lock size={14}/>

                    </EtiquetaTarefa>

                }

                <h1 className='break-words'>{props.nomeTarefa}</h1>

            </div>

            <div className="flex justify-end items-center">

                {

                    props.tarefaPublica &&

                    <div className='flex justify-center items-center'>

                        <ButtonIconeTarefa onClick={() => router.push(`/tarefa/${props.id}`)}>

                            <MessageCircle size={18}/>

                        </ButtonIconeTarefa>

                        <ButtonIconeTarefa onClick={() => copiarLinkTarefa(props.id)}>

                            <Share2 size={17}/>

                        </ButtonIconeTarefa>

                    </div>

                }
            
                <ButtonIconeTarefa onClick={() => deletarTarefa(props.id)}>

                    <Trash size={17}/>

                </ButtonIconeTarefa>

            </div>

        </div>

    )

}

function EtiquetaTarefa({children}: {children: ReactNode}) {

    return (

        <span className="text-xs bg-primary py-0.5 px-2 rounded text-background font-semibold
        uppercase flex justify-center items-center space-x-2">
        
            {children}
        
        </span>

    )

}

function ButtonIconeTarefa({...rest}: ButtonHTMLAttributes<HTMLButtonElement>) {

    return (

        <button className='p-2.5 rounded-full hover:bg-foreground-hover transition-all
        active:scale-95' {...rest}></button>

    )

}