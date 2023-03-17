import { AlertCtx } from "@/context/global/alert"
import { Pagination } from "@/model/pagination";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from 'react';

export const useAlert = () => ({ ...useContext(AlertCtx) });

export const useModal = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const onTap = () => {
        setIsOpen(!isOpen);
    }

    const set = (state: boolean) => {
        setIsOpen(state);
    }

    return { isOpen, onTap, set };

};



export const usePagination = (items: number) => {

    const [state, setState] = useState<Pagination>({ items: 0, page: 0 });
    const [len, setLen] = useState<number>(0);

    useEffect(() => {
        setState(state => ({ ...state, items }));
    }, [items])


    const next = (page: number) => {
        if (len === 0) {
            setState(state => ({ ...state, stop: true }));
        }
        else if (!state.stop) {
            setState(state => ({ ...state, page }));
        }
    }

    const prec = (page: number) => {
        if (page >= 0 && page !== state.page) {
            setState(state => ({ ...state, page, stop: false }));
        }
    }

    return {
        pagination: state,
        next,
        prec,
        len,
        setLen
    };

}