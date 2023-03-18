import { FuzzerCtx } from "@/context/fuzzer";
import { useInjection } from "@/hook/fuzzer/injection";
import { useFuzzer } from "@/hook/reducer/fuzzer";
import { FC, useContext } from "react";
import ModalInjection from ".";

const CreateModalInjection: FC = () => {

    const { isOpenInjection, openInjection } = useContext(FuzzerCtx);
    const { file, clear, placeholder, regex, text, outputRegex, isValidPlaceholder } = useInjection();
    const { addInjection, updateReq } = useFuzzer();


    const cb = () => {
        updateReq();
        addInjection({
            occurrences: placeholder.occurences.filter((e, i) => placeholder.occurencesCheck[i]),
            payload: [],
            placeholder: placeholder.placeholder,
            outputRegex,
            file,
            regex: regex.regex,
            sizeRegex: regex.size,
            text
        });
        clear();
        openInjection(false);
    }

    return (
        <ModalInjection {...{ title: "Create injection", id: "modal-injection", cb, isOpenInjection, openInjection }} />
    );
}

export default CreateModalInjection;