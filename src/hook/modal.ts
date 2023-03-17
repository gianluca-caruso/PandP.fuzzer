import { RefObject, useEffect, useRef, useState } from "react";



export interface IModal {
    onTap: () => void,
    isOpen: boolean,
    set: (state:boolean) => void //  to open moda
}

export type TypeUseModal = () => [isOpen: boolean, onTap: () => void, set: (state:boolean) => void];

const useModal: TypeUseModal = () => {

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const onTap = () => {
        setIsOpen(!isOpen);
    }

    const set = (state: boolean) => {
        setIsOpen(state);
    }

    return [isOpen, onTap, set]

};


export default useModal;