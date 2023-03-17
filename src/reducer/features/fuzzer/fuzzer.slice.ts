import { Fuzzer as IFuzzer, FuzzerRequest, Injection } from '@/model/fuzz';
import type { RootState } from '@/reducer/store';
import { harRequestToRaw } from '@/utils/zap/har';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { Injection as IDBInjection } from '@prisma/client';


const initialState: IFuzzer = {
    name: '',
    rawRequest: '',
    injections: [],
};

export const extractPayload = (injection: Injection) => {

    const { file, outputRegex, text } = injection;

    const payload = [
        ...(file ? file.split(/\r?\n/) : []),
        ...(outputRegex ? outputRegex.split("\n") : []),
        ...(text ? text.split(/\r?\n/) : []),
    ];

    return payload;

}

export const fuzzerSlice = createSlice({
    name: 'fuzzer',
    initialState,
    reducers: {

        set: (state, action: PayloadAction<IFuzzer>) => {
            const { injections, ...other } = action.payload;
            return {
                ...other,
                injections: injections.map(e => ({ ...e, payload: extractPayload(e) }))
            };
        },
        buildPayloadInjections: (state) => {
            state.injections = state.injections.map(e => ({ ...e, payload: extractPayload(e) }));
        },
        setInjections: (state, action: PayloadAction<Injection[]>) => {
            state.injections = action.payload.map(e => ({ ...e, payload: extractPayload(e) }));
        },
        setId: (state, action: PayloadAction<number>) => {
            state.id = action.payload;
        },
        setName: (state, action: PayloadAction<string>) => {
            state.name = action.payload;
        },
        setRawReq: (state, action: PayloadAction<string>) => {
            state.rawRequest = action.payload;
        },
        clear: (state) => {
            state.id = undefined;
            state.name = "";
            state.injections = [];
            state.rawRequest = "";
        }
    },
})

export const { clear, setName, setId, setRawReq, setInjections, set, buildPayloadInjections } = fuzzerSlice.actions;

export const selectFuzzer = (state: RootState) => state.fuzzer;

export default fuzzerSlice.reducer;