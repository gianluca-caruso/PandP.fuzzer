import { IReactComponentChildren } from "@/context";
import { createContext, FC, useCallback, useState } from "react";

export interface Regex {
    regex: string
    size: number
}

export interface IRegexCtx {
    regex: Regex
    output: string
    generate: (out: string) => void
    set: (regex: Regex) => void
    clearOutput: () => void
    clear: () => void
}


export const RegexCtx = createContext<IRegexCtx>({
    output: "",
    regex: { regex: "", size: 0 },
    generate(out) { },
    set(regex) { },
    clearOutput() { },
    clear() { }
});


const ProviderFuzzerInjectionRegex: FC<IReactComponentChildren> = ({ children }) => {

    const [regex, setRegex] = useState<Regex>({
        regex: "",
        size: 0
    });

    const [output, setOutput] = useState<string>("");

    return (
        <RegexCtx.Provider value={{
            output,
            regex,
            set(regex) {
                setRegex(state => ({ ...state, ...regex }));
            },
            clearOutput() {
                setOutput("");
            },
            clear: useCallback(() => {
                setOutput("");
                setRegex({
                    regex: "",
                    size: NaN
                });
            }, []),
            generate(out) {
                setOutput(out);
            },

        }}>
            {children}
        </RegexCtx.Provider>
    )
}

export default ProviderFuzzerInjectionRegex;