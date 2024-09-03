import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {

    variant?: 'ghost' | 'foreground' | 'outline',
    animated?: boolean,

}

export default function Button({ variant, animated, className, ...props }: ButtonProps) {

    let classNamePadrao = `inline-flex items-center justify-center whitespace-nowrap rounded-md 
    text-sm h-9 font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring 
    disabled:pointer-events-none disabled:opacity-50 shadow px-4 py-2`

    if (variant == 'ghost') classNamePadrao += ` bg-transparent hover:bg-foreground`
    else if (variant == 'foreground') classNamePadrao += ` bg-foreground hover:bg-foreground-hover`
    else if (variant == 'outline') classNamePadrao += ` bg-transparent hover:bg-foreground border border-border`
    else classNamePadrao += ` bg-primary hover:bg-primary-hover text-background`

    if (animated) classNamePadrao += ` active:scale-95`

    let classNameCompleta = classNamePadrao

    if (className) classNameCompleta = `${classNamePadrao} ${className}`

    return (

        <button className={classNameCompleta} {...props}></button>

    )

}