import { HTMLAttributes } from "react";
import { FC, ReactNode } from "react"


export interface ITable { }


const Table: FC<ITable & HTMLAttributes<HTMLTableElement>> = ({ className, children, ...attributes }) => {


    return (

        <table className={`table ${className}`} {...attributes}>
            {children}
        </table>

    )
}

export default Table;