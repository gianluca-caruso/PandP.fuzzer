import { IReactComponentChildren } from "@/context";
import { createContext, FC, useCallback, useState } from "react";



export interface ITextCtx {
    text: string,
    set: (text: string) => void,
    clear: () => void

}


export const TextCtx = createContext<ITextCtx>({
    text: "",
    set(Text) {
    },
    clear() {
    },

});


const ProviderFuzzerInjectionText: FC<IReactComponentChildren> = ({ children }) => {

    const [text, setText] = useState<string>("");

    return (
        <TextCtx.Provider value={{
            text,
            set: useCallback((text: string) => {
                setText(text);
            }, []),
            clear: useCallback(() => {
                setText("");
            }, [])
        }}>
            {children}
        </TextCtx.Provider>
    )
}

export default ProviderFuzzerInjectionText;