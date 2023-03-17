import React, { useEffect, useState } from 'react'

import { useAppSelector, useAppDispatch } from '@/hook/reducer';
import { addMsg, clear, IMsgResponseFuzzer, removeMgs } from '@/reducer/features/fuzzer/response.slice';


export const useRespFuzzer = () => {

    const queue = useAppSelector((state) => state.responseFuzzer.queue);
    const dispatch = useAppDispatch();

    const add = (msg: IMsgResponseFuzzer) => {
        dispatch(addMsg({ ...msg, createdAt: msg.createdAt ?? new Date(Date.now()).toLocaleString() }))
    };

    const addAsync = (msg: IMsgResponseFuzzer) => Promise.resolve(add(msg));

    const remove = (msg: string) => {
        dispatch(removeMgs(msg));
    };

    const removeAsync = (msg: string) => Promise.resolve(remove(msg));
    const clearAsync = () => Promise.resolve(dispatch(clear()));

    return {
        queue,
        add,
        addAsync,
        remove,
        removeAsync,
        clearAsync,
        clear: () => dispatch(clear())
    };

}