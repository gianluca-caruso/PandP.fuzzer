import { IReactComponentChildren } from "@/context";
import { createContext, FC, useCallback, useState } from "react";



export interface IFileCtx {
    file: string,
    set: (file: string) => void,
    clear: () => void,
}


export const FileCtx = createContext<IFileCtx>({
    file: "",
    set(file) { },
    clear() { },

});


const ProviderFuzzerInjectionFile: FC<IReactComponentChildren> = ({ children }) => {

    const [fileState, setFileState] = useState<string>("");


    return (
        <FileCtx.Provider value={{
            file: fileState,
            set(file) {
                setFileState(file);
            },
            clear: useCallback(() => {
                setFileState("");
            }, []),
        }}>
            {children}
        </FileCtx.Provider>
    )
}

export default ProviderFuzzerInjectionFile;