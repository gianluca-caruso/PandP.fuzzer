import { AlertEnum } from "@/components/alert";
import { trpc } from "@/utils/trpc";
import { useSession } from "next-auth/react";
import { createContext, FC, useContext, useEffect, useState } from "react";
import { IReactComponentChildren } from "..";
import { AlertCtx } from "./alert";

export type Theme = "light" | "dark" | "system" | "none";
export const Themes = ["light", "dark", "system", "none"] as const;

export interface IThemeContext {
    theme: Theme
    onSwap: (theme: Theme) => void
}

export const ThemeContext = createContext<IThemeContext>({ theme: "system", onSwap: (theme) => { } });

// TODO: ThemeProvider without session and one with session in based useSession status
const ThemeWithSession: FC<IReactComponentChildren> = ({ children }) => {

    const trpcTheme = trpc.setting.theme.useQuery();
    const [theme, setTheme] = useState<Theme>("system");
    const trpcSetTheme = trpc.setting.setTheme.useMutation();

    const {setAlert} = useContext(AlertCtx);

    useEffect(() => {
        setTheme(trpcTheme.data as Theme);

    }, [trpcTheme.data, trpcTheme.isFetched])


    useEffect(() => { //html and body change data-theme

        document.documentElement.setAttribute("data-theme", theme);
        document.body.setAttribute("data-theme", theme);

    }, [theme]);

    const onSwap = (newTheme: Theme) => {
       
        trpcSetTheme?.mutate(newTheme, {
            onSuccess(data) {
                if (data && data.settings && data.settings.theme) {
                    setTheme(data.settings.theme as Theme);
                }else{
                    setAlert({
                        msg:"the theme isn't update. Please, try again later",
                        type: AlertEnum.error
                    });
                }
            },
            onError(error){
                setAlert({
                    msg:error.message,
                    type: AlertEnum.error
                });
            }
        });

    }

    return (
        <ThemeContext.Provider value={{ theme, onSwap }}>
            {children}
        </ThemeContext.Provider>
    )
}

const ThemeWithoutSession: FC<IReactComponentChildren> = ({ children }) => {

    const [theme, setTheme] = useState<Theme>("system");


    useEffect(() => { //html and body change data-theme
        document.documentElement.setAttribute("data-theme", theme);
        document.body.setAttribute("data-theme", theme);
    }, [theme]);

    const onSwap = (newTheme: Theme) => {
        setTheme(newTheme);
    }

    return (
        <ThemeContext.Provider value={{ theme, onSwap }}>
            {children}
        </ThemeContext.Provider>
    )
}


const ThemeProvider: FC<IReactComponentChildren> = ({ children }) => {

    const { status } = useSession();

    return (
        <>
            {status === "authenticated" ?
                <ThemeWithSession>
                    {children}
                </ThemeWithSession>
                :
                <ThemeWithoutSession>
                    {children}
                </ThemeWithoutSession>
            }
        </>
    );

}

export default ThemeProvider;
