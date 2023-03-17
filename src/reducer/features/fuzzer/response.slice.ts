import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/reducer/store';


type TypeMsgEnum = "warning" | "success" | "info" | "error";

export interface IMsgResponseFuzzer {
    msg: string
    type: TypeMsgEnum
    createdAt?: string
}

export interface IResponseFuzzer {

    queue: IMsgResponseFuzzer[]
}

const initialState: IResponseFuzzer = {
    queue: []
}

export const responseFuzzerSlice = createSlice({
    name: 'responseFuzzer',
    initialState,
    reducers: {
        addMsg: (state, action: PayloadAction<IMsgResponseFuzzer>) => {
            state.queue.push(action.payload);
        },
        removeMgs: (state, action: PayloadAction<string>) => {
            state.queue = state.queue.filter(e => action.payload !== e.msg);
        },
        clear: (state) => {
            state.queue = []
        }
    },
})

export const { addMsg, clear, removeMgs } = responseFuzzerSlice.actions

export const selectResponseFuzzer = (state: RootState) => state.responseFuzzer;

export default responseFuzzerSlice.reducer