import { TextareaHTMLAttributes } from "react";

export default function TextArea({className, ...rest}: TextareaHTMLAttributes<HTMLTextAreaElement>) {

    let classNamePadrao = `flex rounded-t-md border border-border border-b-primary bg-transparent 
    px-3 py-2 placeholder:text-text-secondary focus:outline-none disabled:cursor-not-allowed 
    hover:bg-foreground focus:bg-foreground disabled:opacity-50`
        
    let classNameCompleta = classNamePadrao

    if (className) classNameCompleta = `${classNamePadrao} ${className}`

    return (

        <textarea className={classNameCompleta} {...rest}></textarea>

    )

}