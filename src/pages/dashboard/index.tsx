import Button from "@/components/ui/button"
import CardTarefa from "@/components/cardTarefa"
import TextArea from "@/components/ui/textArea"
import PaginacaoTarefas from "@/components/paginacaoTarefas"
import Tela from "@/components/tela"

import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import { Plus } from 'lucide-react'
import { FormEvent, use, useEffect, useState } from "react"

import db from "@/services/firebaseConnection"
import { addDoc, collection, query, orderBy, where, onSnapshot } from "firebase/firestore"
import Alert from "@/components/ui/alert"

// -----------------------------------------------------

interface ServerSideProps { user: {

    email: string
    nome: string

}}

export interface ITarefa {

    id: string
    nomeTarefa: string
    tarefaPublica: boolean
    dataCreate: Date
    emailUserCreate: string
    nomeUserCreate: string

}

export default function Dashboard({ user }: ServerSideProps) {

    const [tarefas, setTarefas] = useState<ITarefa[]>([])

    // -----------------------------------------------------

    const [paginaAtual, setPaginaAtual] = useState(1)

    const tarefasPorPagina = 4

    const indexUltimaTarefa = paginaAtual * tarefasPorPagina
    const indexPrimeiraTarefa = indexUltimaTarefa - tarefasPorPagina

    const tarefasDaPaginaAtual = tarefas.slice(indexPrimeiraTarefa, indexUltimaTarefa)

    // -----------------------------------------------------

    const [nomeTarefa, setNomeTarefa] = useState('')
    const [tarefaPublica, setTarefaPublica] = useState(false)

    const [alertProps, setAlertProps] = useState<{texto: string, visivel: boolean}>({

        texto: '',
        visivel: false

    })

    useEffect(() => {

        getTarefas()

    }, [])

    function getTarefas() {

        const tarefasRef = collection(db, 'tarefas')
        const consulta = query(

            tarefasRef,
            orderBy('dataCreate', 'desc'),
            where('emailUserCreate', '==', user.email)

        )

        onSnapshot(consulta, (snapshot) => {

            const tarefasDoUsuario: ITarefa[] = []

            snapshot.forEach((item) => {

                tarefasDoUsuario.push({

                    id: item.id,
                    tarefaPublica: item.data()?.tarefaPublica,
                    nomeTarefa: item.data()?.nomeTarefa,
                    dataCreate: item.data()?.dataCreate,
                    emailUserCreate: item.data()?.emailUserCreate,
                    nomeUserCreate: item.data()?.nomeUserCreate

                })

            })

            setTarefas(tarefasDoUsuario)

        })

    }

    async function registrarTarefa(event: FormEvent) {

        event.preventDefault()

        if (nomeTarefa === '') return

        try {
            
            await addDoc(collection(db, 'tarefas'), {

                nomeTarefa: nomeTarefa,
                tarefaPublica: tarefaPublica,
                dataCreate: new Date(),
                emailUserCreate: user.email,
                nomeUserCreate: user.nome

            })

            setNomeTarefa('')
            setTarefaPublica(false)

        } catch (error) {
            
            console.log('Erro: ', error)

        }

    }

    function showAlert(texto: string) {

        setAlertProps({

            texto: texto,
            visivel: true

        })

        setTimeout(() => setAlertProps({

            texto: '',
            visivel: false

        }), 2000)

    }

    return (

        <Tela col tituloHead="Painel de tarefas" tituloTela="Tarefas em mente? Veio ao lugar certo!">

            {

                alertProps.visivel && <Alert texto={alertProps.texto}/>

            }

            <section className="flex justify-center items-start
            w-full md:w-full lg:w-10/12
            flex-col md:flex-row lg:flex-row
            space-x-0 md:space-x-10 lg:space-x-10
            space-y-10 md:space-y-0 lg:space-y-0
            xl:max-w-7xl">

                <form className="flex justify-center items-start flex-col
                w-full md:w-9/12 lg:w-6/12 transition-all" 
                onSubmit={(e) => registrarTarefa(e)}>

                    <TextArea 
                    placeholder="Descreva sua tarefa aqui:" 
                    rows={8}
                    value={nomeTarefa}
                    className="w-full"
                    maxLength={200}
                    onChange={(e) => setNomeTarefa(e.target.value)}></TextArea>

                    <div className="mt-3 space-x-2">

                        <input 
                        type="checkbox" 
                        id="tarefaPublica"
                        className="w-4 h-4"
                        checked={tarefaPublica}
                        onChange={() => setTarefaPublica(!tarefaPublica)}/>

                        <label htmlFor="tarefaPublica">Tarefa pública</label>

                    </div>

                    <Button type="submit" className="mt-8 w-full space-x-2">
                        
                        <Plus size={16}/>
                        <span>Adicionar</span>

                    </Button>

                </form>
                
                <div className="flex justify-center items-center flex-col
                w-full md:w-9/12 lg:w-6/12 transition-all space-y-8">

                    <div className="w-full flex justify-center
                    items-center flex-col space-y-3">

                        {

                            tarefas.length > 0

                            ? 

                            <>
                            
                                {

                                    tarefasDaPaginaAtual.map(item => (

                                    <CardTarefa 
                                    key={item.id}
                                    id={item.id}
                                    nomeTarefa={item.nomeTarefa} 
                                    tarefaPublica={item.tarefaPublica}
                                    showAlert={showAlert}/>

                                ))

                                }

                                <PaginacaoTarefas
                                key={null} 
                                totalTarefas={tarefas.length} 
                                paginaAtual={paginaAtual}
                                setPagina={setPaginaAtual}/>
                            
                            </>
                            
                            : <h1 className="text-text-secondary">
                                
                                Crie sua primeira tarefa no menu à esquerda!
                                
                            </h1>

                        }

                    </div>

                </div>

            </section>

        </Tela>

    )

}

// -----------------------------------------------------

export const getServerSideProps: GetServerSideProps = async ({ req }) => {

    const session = await getSession({ req })

    if (!session?.user) {

        return {

            redirect: {

                destination: '/',
                permanent: false

            }

        }

    }

    return {

        props: {

            user: {

                email: session.user.email,
                nome: session.user.name

            }

        }

    }

}