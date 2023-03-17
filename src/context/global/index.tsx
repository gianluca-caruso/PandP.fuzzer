import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { FC } from "react";
import { IReactComponentChildren } from "..";
import AlertProvider from "./alert";
import ThemeProvider from "./theme";

export interface IGlobalProvider {
    session: Session | undefined
}


const GlobalProvider: FC<IGlobalProvider & IReactComponentChildren> = ({ children, session }) => {

    return (
        <AlertProvider>
            <SessionProvider {...{ session }}>
                <ThemeProvider>
                    {children}
                </ThemeProvider>
            </SessionProvider>
        </AlertProvider>
    );

};

export default GlobalProvider;