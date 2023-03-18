import { FuzzerCtx } from "@/context/fuzzer";
import dynamic from "next/dynamic";
import { useContext } from "react";


const DynamicBottomDrawerFuzzer = dynamic(() => import("../drawer/fuzzer"));
const DynamicModalInjections = dynamic(() => import("../modal/injections"));
const DynamicCreateModalInjection = dynamic(() => import("../modal/injection/create"));

const FuzzerComponents = () => {

    const { isOpenHarFuzzer, isOpenInjections, isOpenInjection } = useContext(FuzzerCtx);

    return (
        <>
            {isOpenHarFuzzer ? <DynamicBottomDrawerFuzzer /> : <></>}
            {isOpenInjections ? <DynamicModalInjections /> : <></>}
            {isOpenInjection ? <DynamicCreateModalInjection /> : <></>}
        </>
    );
};

export default FuzzerComponents;


