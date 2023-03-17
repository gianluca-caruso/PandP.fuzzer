import { configureStore } from '@reduxjs/toolkit'
import responseFuzzerReducer from './features/fuzzer/response.slice';
import fuzzerReducer from './features/fuzzer/fuzzer.slice';


export const store = configureStore({
    reducer: {
        responseFuzzer: responseFuzzerReducer,
        fuzzer: fuzzerReducer
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;