import useModal, { IModal } from "@/hook/modal";
import { createContext, FC, RefObject, useContext, useRef, useState } from "react";
import { IReactComponentChildren } from "..";





export const ProfileCtx = createContext<IModal>({
    onTap() { },
    isOpen: false,
    set(state) { },
});


const ProfileProvider: FC<IReactComponentChildren> = ({ children }) => {


    const [isOpen, onTap, set] = useModal();

    return (
        <ProfileCtx.Provider value={{
            isOpen,
            onTap,
            set
        }}>
            {children}
        </ProfileCtx.Provider>
    );
};

export default ProfileProvider;