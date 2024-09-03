import { Check } from 'lucide-react'

export default function Alert({texto}: {texto: string}) {

    return (

        <div className="absolute bg-primary p-3
        text-background font-semibold text-sm rounded-md
        top-20 right-4 flex justify-center items-center space-x-3">
            
            <div className='bg-background rounded-full p-0.5'>

                <Check size={14} className='text-text-primary'/>    

            </div>

            <span className='text-text-secondary/50'>|</span>

            <span>{texto}</span>
            
        </div>

    )

}