import { FuzzerCtx } from "@/context/fuzzer";
import { useContext } from "react";
import BottomDrawerFuzzer from "../drawer/fuzzer";
import { CreateModalInjection } from "../modal/injection/injection";
import ModalInjections from "../modal/injections";



export const FuzzerComponents = () => {

    const { isOpenHarFuzzer, isOpenInjections, isOpenInjection } = useContext(FuzzerCtx);

    return (
        <>
            {isOpenHarFuzzer ? <BottomDrawerFuzzer /> : <></>}
            {isOpenInjections ? <ModalInjections /> : <></>}
            {isOpenInjection ? <CreateModalInjection /> : <></>}
        </>
    );
};


