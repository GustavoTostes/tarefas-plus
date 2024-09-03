import CardComentario from "@/components/cardComentario";
import Tela from "@/components/tela";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import TextArea from "@/components/ui/textArea";

import db from "@/services/firebaseConnection";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy, query, where } from "firebase/firestore";

import { Trash } from "lucide-react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { FormEvent, FormHTMLAttributes, useEffect, useState } from "react";

interface ServerSideProps {

    tarefa: ITarefa,
    emailUsuarioLogado: string
    nomeUsuarioLogado: string

}

interface IComentario {

    id: string
    comentario: string
    emailUserCreate: string
    idTarefa: string
    nomeUserCreate: string

}

interface ITarefa {

    id: string
    nomeTarefa: string
    tarefaPublica: boolean
    dataCreate: string
    emailUserCreate: string
    nomeUserCreate: string

}

export default function Tarefa(dadosServer: ServerSideProps) {
    
    const [novoComentarioTarefa, setNovoComentarioTarefa] = useState('')
    const [comentariosTarefa, setComentariosTarefa] = useState<IComentario[]>([])

    const params = useParams<{ id: string }>()

    useEffect(() => {

        getComentarios(params.id)

    }, [])

    async function publicarComentario(event: FormEvent) {

        event.preventDefault()

        if (novoComentarioTarefa === '') return 

        try {
            
            await addDoc(collection(db, 'comentarios'), {

                idTarefa: dadosServer.tarefa.id,
                comentario: novoComentarioTarefa,
                dataCreate: new Date(),
                emailUserCreate: dadosServer.emailUsuarioLogado,
                nomeUserCreate: dadosServer.nomeUsuarioLogado

            })

            setNovoComentarioTarefa('')

        } catch (error) {
            
            console.log('Erro: ', error)

        }

    }

    async function excluirTarefa(idComentario: string) {

        try {
            
            const comentarioRef = doc(db, 'comentarios', idComentario)

            await deleteDoc(comentarioRef)

        } catch (error) {
            
            console.log('Erro: ', error)

        }

    }

    function getComentarios(idTarefa: string) {

        const comentariosRef = collection(db, 'comentarios')
        const consulta = query(

            comentariosRef,
            orderBy('dataCreate', 'desc'),
            where('idTarefa', '==', idTarefa)

        )

        onSnapshot(consulta, (snapshot) => {

            const comentariosTarefa: IComentario[] = []

            snapshot.forEach((item) => {

                comentariosTarefa.push({

                    id: item.id,
                    comentario: item.data()?.comentario,
                    emailUserCreate: item.data()?.emailUserCreate,
                    idTarefa: item.data()?.idTarefa,
                    nomeUserCreate: item.data()?.nomeUserCreate

                })

            })

            setComentariosTarefa(comentariosTarefa)

        })

    }

    return (

        <Tela col tituloHead="Detalhes da tarefa" tituloTela="Veja o que estão falando sobre essa tarefa!">

            <section className="flex justify-center items-start
            w-full md:w-full lg:w-10/12
            flex-col md:flex-row lg:flex-row
            space-x-0 md:space-x-10 lg:space-x-10
            space-y-10 md:space-y-0 lg:space-y-0
            xl:max-w-7xl">

                <div className="w-full md:w-6/12 lg:w-6/12">

                    <div className="w-full flex justify-start items-start flex-col space-y-3
                    h-auto md:h-96 lg:h-96">
                        
                        <TextArea value={dadosServer.tarefa.nomeTarefa} className="w-full" readOnly rows={8}/>
                        <span className="text-text-secondary
                        hidden md:block lg:block">

                            Criada em <span className="font-bold">{dadosServer.tarefa.dataCreate} </span> 
                            por <span className="font-bold">{dadosServer.tarefa.nomeUserCreate}</span>
                            
                        </span>
                    
                    </div>

                    <FormComentario 
                    inputValue={novoComentarioTarefa} 
                    onChangeInput={setNovoComentarioTarefa}
                    onSubmit={publicarComentario} 
                    className="hidden md:flex lg:flex"/>

                </div>

                <div className="w-full md:w-6/12 lg:w-6/12">

                    <div className="w-full border border-border
                    rounded-t-md h-14 flex justify-start items-center px-5">

                        <span className="text-lg font-bold">Comentários</span>

                    </div>

                    <div className="flex justify-start items-start flex-col w-full space-y-3
                    border-b border-l border-r border-border rounded-b-md h-96 p-5 overflow-y-auto">

                        {

                            comentariosTarefa.length != 0

                            ? 
                            
                            comentariosTarefa.map(comentario => (

                                <div className="flex justify-center items-center space-x-4">

                                    <CardComentario 
                                    comentario={comentario.comentario} 
                                    autorComentario={comentario.nomeUserCreate}/>
                                    
                                    {
                                    
                                        dadosServer.emailUsuarioLogado == comentario.emailUserCreate

                                        && 

                                        <div className="flex justify-center items-center">

                                            <button className="p-2 rounded-full
                                            hover:bg-foreground active:scale-95 transition-all"
                                            onClick={() => excluirTarefa(comentario.id)}>

                                                <Trash size={17}/>

                                            </button>

                                        </div>

                                    }

                                </div>

                            ))

                            : 
                            
                            <div className="h-full w-full flex justify-center items-center">

                                <h1 className="text-text-secondary">Não há comentários ainda.</h1>

                            </div>

                        }

                    </div>

                    <FormComentario 
                    inputValue={novoComentarioTarefa} 
                    onChangeInput={setNovoComentarioTarefa}
                    onSubmit={publicarComentario} 
                    className="flex md:hidden lg:hidden"/>

                </div>

            </section>

        </Tela>

    )

}

interface FormComentarioProps extends FormHTMLAttributes<HTMLFormElement> {

    onChangeInput: (value: string) => void
    inputValue: string

}

function FormComentario({className, onChangeInput, inputValue, ...props}: FormComentarioProps) {

    const classNamePadrao = 'w-full items-end h-14 space-x-3'

    let classNameCompleta = classNamePadrao

    if (className) classNameCompleta = `${classNamePadrao} ${className}`

    return (

        <form className={classNameCompleta} {...props}>

            <Input className="w-full" placeholder="Escreva seu comentário aqui!" maxLength={100}
            onChange={(e) => onChangeInput(e.target.value)} value={inputValue}/>
            <Button type="submit" animated>Enviar</Button>

        </form>

    )

}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {

    const session = await getSession({req})

    if (!session?.user) {

        return {

            redirect: {

                destination: '/',
                permanent: false

            }

        }

    }

    // ------------------------------------------------

    const idTarefa = params?.id as string

    const tarefasRef = doc(db, 'tarefas', idTarefa)

    const snapshotTarefa = await getDoc(tarefasRef)

    if (snapshotTarefa.data() === undefined) {

        return {

            redirect: {

                destination: '/dashboard',
                permanent: false

            }

        }

    }

    if (!snapshotTarefa.data()?.tarefaPublica) {

        return {

            redirect: {

                destination: '/dashboard',
                permanent: false

            }

        }

    }

    const miliseconds = snapshotTarefa.data()?.dataCreate?.seconds * 1000

    const tarefa: ITarefa = {

        id: snapshotTarefa.id,
        nomeTarefa: snapshotTarefa.data()?.nomeTarefa,
        tarefaPublica: snapshotTarefa.data()?.tarefaPublica,
        dataCreate: new Date(miliseconds).toLocaleDateString(),
        emailUserCreate: snapshotTarefa.data()?.emailUserCreate,
        nomeUserCreate: snapshotTarefa.data()?.nomeUserCreate

    }

    return { 
        
        props: {

            tarefa,
            emailUsuarioLogado: session.user.email,
            nomeUsuarioLogado: session.user.name

        } 

    }

}