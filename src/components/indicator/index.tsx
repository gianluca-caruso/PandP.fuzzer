import { IReactComponentChildren } from "@/context"
import { FC, HTMLAttributes } from "react"



export const Badge: FC<HTMLAttributes<HTMLSpanElement>> = ({ children, className, ...attributes }) => {

    return (
        <span {...attributes} className={`indicator-item badge bg-base-content ${className}`}>{children}</span>
    )
}


export interface SubcomponentsIndicator {
    Badge: typeof Badge
}

const Indicator: FC<HTMLAttributes<HTMLDivElement>> & SubcomponentsIndicator = ({ className, children, ...attributes }) => {

    return (
        <div className={`indicator w-full ${className}`} {...attributes}>
            {children}
        </div>
    )
}

Indicator.Badge = Badge;


export default Indicator;