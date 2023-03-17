import { AlertEnum, IAlert } from "@/components/alert";
import AlertDefault from "@/components/alert/default";
import AlertError from "@/components/alert/error";
import AlertInfo from "@/components/alert/info";
import AlertSuccess from "@/components/alert/success";
import AlertWarning from "@/components/alert/warning";
import { createContext, FC, useEffect, useState } from "react";
import { IReactComponentChildren } from "..";

export interface IAlertMessage extends IAlert {
    ms?: number
}

export interface IAlertCtx extends IAlert {
    active: boolean
    setActive: (state: boolean) => void
    setAlert: (state: IAlertMessage) => void
}


const SEC = 1000;
export const DEFAULT_MS_ALERT = 4*SEC;

export const AlertCtx = createContext<IAlertCtx>({
    setActive(state) { },
    setAlert(state) { },
    active: false,
    msg: ""
});

export const RenderAlert: FC<IAlert> = ({ msg, type }) => {

    switch (type) {
        case AlertEnum.success:
            return <AlertSuccess {...{ msg }} />
        case AlertEnum.info:
            return <AlertInfo {...{ msg }} />
        case AlertEnum.warning:
            return <AlertWarning {...{ msg }} />
        case AlertEnum.error:
            return <AlertError {...{ msg }} />
        default:
            return <AlertDefault {...{ msg }} />
    }
}


const AlertProvider: FC<IReactComponentChildren> = ({ children }) => {

    const [active, setActiveState] = useState<boolean>(false);
    const [alert, setAlertState] = useState<IAlertMessage>({
        msg: "",
        type: AlertEnum.default,
        ms: DEFAULT_MS_ALERT
    });

    useEffect(() => {
        if (active) {
            const ms = alert.ms ? alert.ms : DEFAULT_MS_ALERT;
            const timeout = setTimeout(() => {
                setActiveState(false);
            }, ms);
            return () => clearTimeout(timeout);
        }

    }, [active, alert.ms])

    const setAlert = (alert: IAlert) => {
        setAlertState(state => ({ ...state, ...alert }));
        setActiveState(true);
    }

    const setActive = (state: boolean) => {
        setActiveState(state);
    }


    return (
        <AlertCtx.Provider value={{
            setActive,
            setAlert,
            active,
            ...alert
        }}>
            {children}
            {active ? <RenderAlert {...alert} /> : <></>}
        </AlertCtx.Provider >
    )
}


export default AlertProvider;


