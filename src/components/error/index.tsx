import { IReactComponentChildren } from "@/context";
import { FC } from "react";


export interface IError extends IReactComponentChildren {
    title: string
    msg?: string | string[]
}

const Error: FC<IError> = ({ title, msg, children }) => {

    return (
        <div className="hero min-h-screen bg-base-300" >
            <div className="hero-content text-center">
                <div className="max-w-md w-5/6">
                    <h1 className="mb-5 text-5xl font-bold">{title}</h1>
                    {Array.isArray(msg) ? msg.map((msg, idx) => {
                        return <p key={idx} className="mb-5 w-full">{msg ?? ""}</p>
                    }) : <p className="mb-5 w-1/2">{msg ?? ""}</p>}
                    {children}
                </div>
            </div>
        </div >
    )
}


export default Error;