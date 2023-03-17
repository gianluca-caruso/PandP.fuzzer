import { AlertEnum } from "@/components/alert";
import { FuzzerCtx } from "@/context/fuzzer";
import { useInjection } from "@/hook/fuzzer/injection";
import { useAlert } from "@/hook/global";
import { useFuzzer } from "@/hook/reducer/fuzzer";
import { Injection } from "@/model/fuzz";
import { FC, useCallback, useContext, useState, HTMLAttributes, useEffect } from "react";
import Modal from "..";
import Tab from "../../tab";
import File from './file';
import Placeholder from "./placeholder";
import Regex from "./regex";
import Text from './text';




export interface IModalInjection {
    isOpenInjection: boolean
    openInjection: (state?: boolean) => void
    cb: () => void,
    id: string
    zIndex?: number,
    title: string
}

export enum EnumTab {
    file,
    text,
    regex
}

const ModalInjection: FC<IModalInjection> = ({ id, cb, isOpenInjection, openInjection, zIndex, title }) => {

    const [tab, setTab] = useState<EnumTab>(EnumTab.regex);
    const { isValidPlaceholder } = useInjection();
    const { setAlert } = useAlert();

    const renderComponent = useCallback(() => {
        switch (tab) {
            case EnumTab.file:
                return <File />
            case EnumTab.text:
                return <Text />
            case EnumTab.regex:
                return <Regex />
            default:
                return <Text />
        }
    }, [tab])

    const onAssign = () => {
        isValidPlaceholder ? cb() : setAlert({ type: AlertEnum.error, msg: "the placeholder isn't valid" });
    }


    return (
        <Modal id={id} isOpen={isOpenInjection} set={openInjection} className={`max-w-lg scrollbar-hide z-[${zIndex}]`}>
            <Modal.Title>{title}</Modal.Title>
            {/* Wrap Modal Body */}
            <Modal.Body>
                {/* Placeholder Wrap */}
                <Placeholder />
                {/* Tab */}
                <Tab>
                    <Tab.Item active={tab === EnumTab.file ? true : false} onClick={() => setTab(EnumTab.file)}>File</Tab.Item>
                    <Tab.Item active={tab === EnumTab.text ? true : false} onClick={() => setTab(EnumTab.text)}>Text</Tab.Item>
                    <Tab.Item active={tab === EnumTab.regex ? true : false} onClick={() => setTab(EnumTab.regex)}>Regex</Tab.Item>
                </Tab>

                {/* render component tab */}
                {renderComponent()}

            </Modal.Body>
            <Modal.Actions>
                <button className="btn" onClick={onAssign}>assign</button>
            </Modal.Actions>

        </Modal>
    );
}

export const CreateModalInjection: FC = () => {

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


export const EditModalInjection: FC<{ placeholder: string, _cb: () => void }> = ({ placeholder: _placeholder, _cb }) => {

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


export default ModalInjection;