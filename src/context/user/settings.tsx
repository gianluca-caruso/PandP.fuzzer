import useModal, { IModal } from "@/hook/modal";
import { createContext, FC } from "react";
import { IReactComponentChildren } from "..";



export const SettingsCtx = createContext<IModal>({
    onTap() { },
    isOpen: false,
    set(state) {},
});


const SettingsProvider: FC<IReactComponentChildren> = ({ children }) => {

    const [isOpen, onTap,set] = useModal();

    return (
        <SettingsCtx.Provider value={{
            isOpen,
            onTap,
            set
        }}>
            {children}
        </SettingsCtx.Provider>
    );
}

export default SettingsProvider;