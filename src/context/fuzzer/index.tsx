import { AlertEnum } from "@/components/alert"
import Container from "@/components/container"
import useModal from "@/hook/modal"
import { useFuzzer } from "@/hook/reducer/fuzzer"
import { useRespFuzzer } from "@/hook/reducer/fuzzer/response"
import { Fuzzer as IFuzzer } from "@/model/fuzz"
import { Request as HarRequest } from "@/model/har"
import { getAnchorDownloadFile } from "@/utils/file"
import { trpc } from "@/utils/trpc"
import { isZapError } from "@/utils/zap"
import { fuzzerToHar, fuzzerToRawRequests } from "@/utils/zap/har/generate"
import { fuzzerToPlanYaml } from "@/utils/zap/plan/generate"
import { fuzzerToZest } from "@/utils/zap/zest"
import { createContext, FC, useContext } from "react"
import { IReactComponentChildren } from ".."
import { AlertCtx } from "../global/alert"
import HarProvider from "./har"
import ProviderFuzzerInjection from "./injection"


export interface IFuzzerCtx {

    //actions menu

    //manage injections
    isOpenInjections: boolean //  to open modal
    openInjections: (state?: boolean) => void
    isOpenInjection: boolean //  to open modal
    openInjection: (state?: boolean) => void
    isOpenEditInjection: boolean
    openEditInjection: (state?: boolean) => void

    //download
    openDownloadPlanYaml: () => void
    openDownloadHar: () => void
    openDownloadRaw: () => void
    openDownloadZest: () => void

    // fuzzer panel
    onLoadFuzzerScript: () => void
    onRunFuzzer: () => void
    onRemoveFuzzerScript: () => void


    //har-fuzzer
    openHarFuzzer: (state?: boolean) => void
    isOpenHarFuzzer: boolean

    // fuzzer
    fuzzer: ReturnType<typeof useFuzzer> | null


}

export const FuzzerCtx = createContext<IFuzzerCtx>({
    openInjections() { },
    openInjection() { },
    openEditInjection() { },
    openDownloadPlanYaml() { },
    openDownloadHar() { },
    openDownloadRaw() { },
    openDownloadZest() { },
    openHarFuzzer() { },
    onLoadFuzzerScript() { },
    onRunFuzzer() { },
    onRemoveFuzzerScript() { },
    isOpenHarFuzzer: false,
    isOpenInjection: false,
    isOpenEditInjection: false,
    isOpenInjections: false,
    fuzzer: null
});

enum Modals {
    injection,
    injections,
    fuzzers
}


const ProviderFuzzerMenu: FC<IReactComponentChildren> = ({ children }) => {

    // main
    const fuzzer = useFuzzer();

    //manage injections, injection ,edit injection and har

    const [isOpenInjections, onTapInjections, setOpenInjections] = useModal();
    const [isOpenInjection, onTapInjection, setOpenInjection] = useModal();
    const [isOpenEditInjection, onTapEditInjection, setOpenEditInjection] = useModal();
    const [isOpenHarFuzzer, onTapHarFuzzer, setOpenHarFuzzer] = useModal();

    const openInjections = (state?: boolean) => state ? setOpenInjections(state) : onTapInjections();
    const openInjection = (state?: boolean) => state ? setOpenInjection(state) : onTapInjection();
    const openEditInjection = (state?: boolean) => state ? setOpenEditInjection(state) : onTapEditInjection();
    const openHarFuzzer = (state?: boolean) => state ? setOpenHarFuzzer(state) : onTapHarFuzzer();


    // download
    const openDownloadPlanYaml = () => {
        const plan = fuzzerToPlanYaml(fuzzer.state);
        const a = getAnchorDownloadFile({
            data: plan,
            filename: `${fuzzer.state.name}.yaml`,
            type: 'application/yaml'
        });
        a.click();
    };

    const openDownloadHar = () => {

        const har = fuzzerToHar(fuzzer.state);
        const a = getAnchorDownloadFile({
            data: har,
            filename: `${fuzzer.state.name}.har`,
            type: "application/json"
        });
        a.click();
    };

    const openDownloadRaw = () => {
        const rawRequets = fuzzerToRawRequests(fuzzer.state).join("\n\n");
        const a = getAnchorDownloadFile({
            data: rawRequets,
            filename: `${fuzzer.state.name}.txt`,
            type: "application/text"
        });
        a.click();
    };

    const openDownloadZest = () => {
        const zest = fuzzerToZest(fuzzer.state);
        const a = getAnchorDownloadFile({
            data: zest,
            filename: `${fuzzer.state.name}.zst`,
            type: "application/zest"
        });
        a.click();
    };

    // static error trpc
    const onError = (err: { message: string }) => {
        setAlert({ msg: err.message, type: AlertEnum.error });
        addMsgRespFuzzer({ msg: err.message, type: "error" });
    };

    //log
    const { setAlert } = useContext(AlertCtx);
    const { add: addMsgRespFuzzer } = useRespFuzzer();


    // zap panel 
    const loadFuzzerScript = trpc.fuzzer.script.load.useMutation({
        onError,
        onSuccess(data) {
            data && addMsgRespFuzzer({ msg: "fuzzer script loaded", type: "success" });
        },
    });

    const runFuzzerScript = trpc.fuzzer.script.run.useMutation({
        onError,
        onSuccess(data) {
            data && addMsgRespFuzzer({ msg: "fuzzer script executed", type: "success" });
        }
    });

    const removeFuzzerScript = trpc.fuzzer.script.remove.useMutation({
        onError,
        onSuccess(data) {
            data && addMsgRespFuzzer({ msg: "fuzzer script removed", type: "warning" });
        }
    });

    // execute script
    const onRunFuzzer = () => {
        addMsgRespFuzzer({ msg: "fuzzer script executing...", type: "info" });
        runFuzzerScript.mutate(fuzzer.state.name);
    }

    // remove script
    const onRemoveFuzzerScript = async () => removeFuzzerScript.mutate(fuzzer.state.name);

    //load script
    const onLoadFuzzerScript = () => {

        const { injections, name, rawRequest } = fuzzer.state;
        addMsgRespFuzzer({ msg: "fuzzer script building...", type: "info" });
        const data = { injections, name, rawRequest };
        addMsgRespFuzzer({ msg: "fuzzer script built ", type: "success" });
        addMsgRespFuzzer({ msg: "fuzzer script sending...", type: "info" });
        loadFuzzerScript.mutate(data)
    }


    return (
        <FuzzerCtx.Provider
            value={{
                openInjections,
                openEditInjection,
                isOpenEditInjection,
                openInjection,
                openDownloadPlanYaml,
                openDownloadHar,
                openDownloadRaw,
                openDownloadZest,
                openHarFuzzer,
                onLoadFuzzerScript,
                onRemoveFuzzerScript,
                onRunFuzzer,
                isOpenHarFuzzer,
                isOpenInjection,
                isOpenInjections,
                fuzzer
            }}
        >
            <ProviderFuzzerInjection>
                {children}
            </ProviderFuzzerInjection>
        </FuzzerCtx.Provider>
    )
}

export const WrapFuzzer: FC<IReactComponentChildren> = ({ children }) => {

    return (

        <Container>
            <ProviderFuzzerMenu>
                <HarProvider>
                    {children}
                </HarProvider>
            </ProviderFuzzerMenu>
        </Container>
    )
}

export default ProviderFuzzerMenu;