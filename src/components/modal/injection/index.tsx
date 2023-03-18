import { AlertEnum } from "@/components/alert";
import { FuzzerCtx } from "@/context/fuzzer";
import { useInjection } from "@/hook/fuzzer/injection";
import { useAlert } from "@/hook/global";
import { useFuzzer } from "@/hook/reducer/fuzzer";
import { Injection } from "@/model/fuzz";
import { FC, useCallback, useContext, useState, HTMLAttributes, useEffect } from "react";
import Modal from "..";
import Tab from "../../tab";
import File from './components/file';
import Placeholder from "./components/placeholder";
import Regex from "./components/regex";
import Text from './components/text';


export * as EditModalInjection from "./edit";
export * as CreateModalInjection from "./create";

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

export default ModalInjection;