import { FuzzerCtx } from "@/context/fuzzer";
import { useInjection } from "@/hook/fuzzer/injection";
import { useFuzzer } from "@/hook/reducer/fuzzer";
import { FC, useContext } from "react";
import ModalInjection from ".";

const EditModalInjection: FC<{ placeholder: string, _cb: () => void }> = ({ placeholder: _placeholder, _cb }) => {

    const { isOpenEditInjection, openEditInjection } = useContext(FuzzerCtx);
    const { file, clear, placeholder, regex, text, set, outputRegex } = useInjection();
    const { updateInjection } = useFuzzer();


    const cb = () => {

        updateInjection({
            occurrences: placeholder.occurences.filter((e, i) => placeholder.occurencesCheck[i]),
            payload: [],
            placeholder: placeholder.placeholder,
            file,
            regex: regex.regex,
            sizeRegex: regex.size,
            outputRegex,
            text
        }, _placeholder)
            .then((data) => {
                clear();
                openEditInjection(false);
                _cb();
            });

    }

    return (
        <ModalInjection {...{ title: "Edit injection", id: "edit-modal-injection", cb, isOpenInjection: isOpenEditInjection, openInjection: openEditInjection }} />
    );
}

export default EditModalInjection;