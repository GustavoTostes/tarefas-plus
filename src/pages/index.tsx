import Button from "@/components/ui/button";
import { signIn, getSession } from 'next-auth/react'
import { GetServerSideProps } from "next";
import TituloHead from "@/components/tituloHead";
import TituloTela from "@/components/tituloTela";

export default function Home() {

    return (

        <main className="flex justify-center items-center
        h-[calc(100vh-4rem)] flex-col p-10">

            <TituloHead>Terefas + | Todas as suas tarefas, em um só lugar.</TituloHead>

            <TituloTela>Todas as suas tarefas, em um só lugar.</TituloTela>

            <Button className="mt-14" animated onClick={() => signIn('google')}>Log-in</Button>
        
        </main>

    )

}

// -------------------------------------

export const getServerSideProps: GetServerSideProps = async (req) => {

    const session = await getSession(req)

    if (session?.user) {

        return {

            redirect: {

                destination: '/dashboard',
                permanent: false

            }

        }

    }

    return {

        props: {}

    }

}