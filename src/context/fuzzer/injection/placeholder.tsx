import { IReactComponentChildren } from "@/context";
import { useFuzzer } from "@/hook/reducer/fuzzer";
import { createContext, FC, useState, useContext, useCallback } from "react";
import { FuzzerCtx } from "..";

export interface Placeholder {
    placeholder: string,
    occurences: number[],
    occurencesCheck: boolean[],
}

export interface IPlaceholderCtx {
    placeholder: Placeholder,
    set: (placeholder: string) => void
    isValid: boolean,
    setOccurence: (idx: number, state: boolean) => void,
    setOccurences: (ids: number[]) => void
    clear: () => void
}


export const PlaceholderCtx = createContext<IPlaceholderCtx>({
    placeholder: {
        placeholder: "",
        occurences: [],
        occurencesCheck: []
    },
    setOccurences(ids) { },
    isValid: false,
    set(placeholder) { },
    setOccurence(idx, state) { },
    clear() { },
});


const ProviderFuzzerInjectionPlaceholder: FC<IReactComponentChildren> = ({ children }) => {

    const [placeholder, setPlaceholder] = useState<Placeholder>({ placeholder: "", occurences: [], occurencesCheck: [] });
    const [isValid, setIsValid] = useState<boolean>(false);

    const { state: fuzzer, } = useFuzzer();


    return (
        <PlaceholderCtx.Provider value={{
            placeholder: placeholder,
            clear: useCallback(() => {
                setPlaceholder({
                    occurences: [],
                    occurencesCheck: [],
                    placeholder: ""
                });
                setIsValid(false);
            }, []),
            isValid,
            set(str) {

                if (fuzzer.rawRequest.includes(str)) {
                    setIsValid(true);

                    const occurencesLen = fuzzer.rawRequest.split(str).length - 1;
                    const occurences: number[] = [];
                    const occurencesCheck: boolean[] = [];

                    if (occurencesLen === 1) {
                        occurences.push(1);
                        occurencesCheck.push(true);
                    } else {
                        occurences.push(-1);
                        occurencesCheck.push(true);
                        for (let index = 1; index <= occurencesLen; index++) {
                            occurences.push(index);
                            occurencesCheck.push(false);
                        }
                    }

                    setPlaceholder(state => ({ occurences, placeholder: str, occurencesCheck }));

                } else {
                    setIsValid(false)
                    setPlaceholder(state => ({ ...state, placeholder: str }));
                }
            },
            setOccurences(ids) {

                setPlaceholder(state => {
                    const newState = { ...state };
                    newState.occurencesCheck = newState.occurencesCheck.map((e, idx) => {
                        if (ids.includes(newState.occurences[idx])) {
                            return true;
                        }
                        return false;
                    })
                    return newState;
                })
            },
            setOccurence(idx, status) {

                setPlaceholder(state => {
                    const newState = { ...state };
                    if (placeholder.occurences[idx] === -1 && status) {
                        newState.occurencesCheck = newState.occurences.map((e, i) => e === -1 ? true : false)
                    }
                    else if (placeholder.occurences[idx] !== -1 && status) {
                        newState.occurencesCheck[idx] = status;
                        let isAll = true;
                        for (let i = 0; i < newState.occurencesCheck.length && isAll; i++) {
                            const state = newState.occurencesCheck[i];
                            const num = newState.occurences[i];
                            if (num !== -1 && !state) {
                                isAll = false;
                            }
                        }
                        if (isAll) {
                            newState.occurencesCheck = newState.occurences.map((e, i) => e === -1 ? true : false)
                        } else {
                            newState.occurencesCheck = newState.occurences.map((e, i) => e === -1 ? false : newState.occurencesCheck[i]);
                        }

                    } else {
                        newState.occurencesCheck[idx] = status;
                    }
                    return newState;
                })
            },

        }}>
            {children}
        </PlaceholderCtx.Provider>
    )
}

export default ProviderFuzzerInjectionPlaceholder;