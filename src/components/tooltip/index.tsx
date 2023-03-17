import { IReactComponentChildren } from "@/context";
import { FC, HTMLInputTypeAttribute, InputHTMLAttributes } from "react";



export interface ITooltip {
    content: string
}


const Tooltip: FC<IReactComponentChildren & InputHTMLAttributes<HTMLInputElement> & ITooltip> = ({ children, content,className, ...attributes }) => {


    return (
        <div className={`tooltip ${className}`} {...attributes} data-tip={content}>
            {children}
        </div>
    )
}

export default Tooltip;