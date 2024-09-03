import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import { LogOut, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Header() {

    const { data } = useSession()

    const router = useRouter()

    const [rotaLogo, setRotaLogo] = useState('/')

    useEffect(() => {

        data && setRotaLogo('dashboard')

    }, [])

    return (

        <header className="bg-background border-b border-border
        flex justify-between items-center h-16
        px-4 md:px-8 lg:px-16">
            
            <div className="flex justify-center items-center space-x-2 cursor-pointer
            select-none" onClick={() => router.push(rotaLogo)}>

                <h1 className="text-xl">T A R E F A S</h1>

                <Plus className='text-text-secondary' size={20}/>

            </div>

            {

                data 
                
                && 
                
                <div className='flex justify-center items-center space-x-3'>

                    <span className='hidden md:flex lg:flex'>Olá, {data.user?.name}.</span>

                    <span className='hidden md:flex lg:flex'>|</span>

                    <button className='rounded-full hover:bg-foreground hover:p-2 active:scale-95 transition-all'
                    onClick={() => signOut()}>

                        <LogOut size={20}/>

                    </button>

                </div> 
                
            }
            
        </header>

    )

}