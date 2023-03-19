import { AlertEnum } from '@/components/alert';
import { useAlert } from '@/hook/global';
import { useAppDispatch, useAppSelector } from '@/hook/reducer';
import { Fuzzer as IFuzzer, Injection } from '@/model/fuzz';
import { buildPayloadInjections, clear, set, setId, setInjections, setName, setRawReq } from '@/reducer/features/fuzzer/fuzzer.slice';
import { trpc } from '@/utils/trpc';
import { useRespFuzzer } from './response';




export const useFuzzer = () => {

    const fuzzer = useAppSelector((state) => state.fuzzer);
    const dispatch = useAppDispatch();

    const { setAlert } = useAlert();
    const { add: addRespFuzzer } = useRespFuzzer();

    const onError = (err: { message: string }) => {
        setAlert({
            msg: err.message,
            type: AlertEnum.error
        });
    };

    const refreshFuzzer = trpc.fuzzer.fuzzer.useMutation({ onError, onSuccess: (data) => data && dispatch(set(data)) });
    const fuzzerRemove = trpc.fuzzer.remove.useMutation({ onError });
    const fuzzerChangeName = trpc.fuzzer.changeFuzzerName.useMutation({ onError, onSuccess: (data) => data && dispatch(set(data)) });
    const fuzzerUpdateRequest = trpc.fuzzer.updateReq.useMutation({ onError, onSuccess: (data) => data && dispatch(set(data)) });
    const fuzzerCreate = trpc.fuzzer.create.useMutation({
        onError, onSuccess(data) {
            if (data) {
                dispatch(set({ id: data.id, name: data.name, injections: [], rawRequest: "" }));
            }
        }
    });
    const fuzzerAddInjection = trpc.fuzzer.injection.add.useMutation({
        onError, onSuccess(data) {
            if (data.injections && data.placeholder) {
                dispatch(setInjections(data.injections));
                addRespFuzzer({
                    msg: `new injection "${data.placeholder}" added`,
                    type: "info"
                });
            }
        },
    });

    const fuzzerUpdateInjection = trpc.fuzzer.injection.update.useMutation({
        onError, onSuccess(data) {
            if (data) {
                addRespFuzzer({
                    msg: `The injection "${data}" has been modified.`,
                    type: "info"
                });
                refreshFuzzer.mutate(fuzzer.name);
            }
        }
    });

    const fuzzerRemoveInjection = trpc.fuzzer.injection.remove.useMutation({
        onError,
        onSuccess(data) {
            if (data) {
                addRespFuzzer({
                    msg: `The injection "${data}" has been removed.`,
                    type: "error"
                });
            }
        },
    });

    const resetReq = () => fuzzerUpdateRequest.mutate({ nameFuzzer: fuzzer.name, rawRequest: "", Injs: fuzzer.injections.map(e => e.placeholder) });
    const updateReq = (injs?: string[], rawReq?: string) => fuzzerUpdateRequest.mutate({ nameFuzzer: fuzzer.name, rawRequest: rawReq ?? fuzzer.rawRequest, Injs: injs ?? [] });
    const createFuzzer = (nameFuzzer?: string) => nameFuzzer ?
        fuzzerCreate.mutateAsync({ name: nameFuzzer, rawRequest: "" }) : fuzzerCreate.mutateAsync({ ...fuzzer, name: fuzzer.name });
    const changeFuzzerName = (name: string, oldName?: string) => fuzzerChangeName.mutateAsync({ oldNameFuzzer: oldName ?? fuzzer.name, newNameFuzzer: name });
    const removeFuzzer = (fuzzers: string[]) => fuzzerRemove.mutateAsync(fuzzers);

    const removeInjection = (placeholder: string) => fuzzerRemoveInjection.mutateAsync({ nameFuzzer: fuzzer.name, placeholder });
    const updateInjection = (injection: Injection, placeholder: string) => fuzzerUpdateInjection.mutateAsync({ injection, name: fuzzer.name, placeholder });
    const addInjection = (injection: Injection) => fuzzerAddInjection.mutate({ name: fuzzer.name, injection });

    const refresh = async () => refreshFuzzer.mutateAsync(fuzzer.name);

    return {
        //crud
        createFuzzer,
        resetReq,
        addInjection,
        updateInjection,
        removeInjection,
        updateReq,
        changeFuzzerName,
        removeFuzzer,
        //state
        state: fuzzer,
        buildPayloadInjections: () => dispatch(buildPayloadInjections()),
        setState: (fuzz: IFuzzer) => dispatch(set(fuzz)),
        setId: (id: number) => dispatch(setId(id)),
        setName: (name: string) => dispatch(setName(name)),
        setRawReq: (req: string) => dispatch(setRawReq(req)),
        setInjections: (injections: Injection[]) => dispatch(setInjections(injections)),
        clear: () => dispatch(clear()),
        refresh,
    };

}
