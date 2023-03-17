import { IReactComponentChildren } from "@/context"
import { FC } from "react"

export enum AlertEnum {
    warning = "alert-warning",
    error = "alert-error",
    success = "alert-success",
    info = "alert-info",
    default = ""
}

export interface IAlertDefault {
    msg: string
}

export interface IAlert extends IAlertDefault {
    type?: AlertEnum
}

const Alert: FC<IAlert & IReactComponentChildren> = ({ msg, type = AlertEnum.default, children }) => {

    return (
        <div className={`alert ${type} shadow-lg fixed bottom-0 right-0 m-2 w-fit z-[1000]`}>
            <div>
                {children}
                <span>{msg}</span>
            </div>
        </div>
    )
}

export default Alert;