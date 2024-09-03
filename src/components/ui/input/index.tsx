import { InputHTMLAttributes } from "react";

export default function Input({className, ...rest}: InputHTMLAttributes<HTMLInputElement>) {

    let classNamePadrao = `flex rounded-md border border-border bg-transparent 
    px-3 py-2 placeholder:text-text-secondary focus:outline-none disabled:cursor-not-allowed 
    hover:bg-foreground focus:bg-foreground disabled:opacity-50 h-9 text-sm`
        
    let classNameCompleta = classNamePadrao

    if (className) classNameCompleta = `${classNamePadrao} ${className}`

    return (

        <input className={classNameCompleta} {...rest}/>

    )

}