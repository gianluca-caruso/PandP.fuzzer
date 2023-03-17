import { AlertEnum } from "@/components/alert";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useAlert, usePagination } from "../global";
import { useFuzzer } from "../reducer/fuzzer";


export const useSelecteItems = () => {

    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const onSelect = (value: boolean, name: string) => {

        if (value) {
            setSelectedItems(state => [...state, name]);
        } else {
            setSelectedItems(state => state.filter(e => e !== name));
        }
    }

    return {
        selectedItems,
        onSelect,
        setSelectedItems
    }
};

export const useFuzzerHandler = () => {

    const { createFuzzer, changeFuzzerName, state: { name }, removeFuzzer } = useFuzzer();
    const { push } = useRouter();
    const { setAlert } = useAlert();

    //create
    const onCreate = useCallback((cb: () => void) => {
        const data = prompt("Type the name of fuzzer");
        if (!data) {
            return;
        }
        createFuzzer(data).then((data) => {
            data /* && push("/fuzzer/" + data.name) */;
            cb();
        });

    }, [createFuzzer]);

    //update
    const onChangeNameFuzzer = useCallback((oldName: string, cb: () => void) => {
        const data = prompt("Type the new name of the selected fuzzer", oldName);
        if (!data) {
            return;
        }
        changeFuzzerName(data, oldName).then((data) => {
            data && setAlert({ msg: "changed the name of the selected fuzzer", type: AlertEnum.success })
            cb();
        });
    }, [changeFuzzerName, setAlert]);

    //remove
    const onRemoveFuzzers = useCallback((_fuzz: string | string[], cb: () => void) => {

        let fuzzers: string[] = [];
        if (typeof _fuzz === "string") {
            fuzzers = [_fuzz];
        }
        fuzzers = [..._fuzz];

        removeFuzzer(fuzzers).then(data => {
            data && setAlert({ msg: "fuzzer removed", type: AlertEnum.warning });
            cb();
        });

    }, [removeFuzzer, setAlert]);

    return {
        onCreate,
        onChangeNameFuzzer,
        onRemoveFuzzers

    };
}


export const useFuzzers = () => {

    const { pagination, next, prec, setLen } = usePagination(5);
    const { onSelect: onSelectF, selectedItems, setSelectedItems } = useSelecteItems();
    const [search, setSearch] = useState<string>("");
    const { setAlert } = useAlert();
    const { onChangeNameFuzzer, onCreate: onCreateF, onRemoveFuzzers } = useFuzzerHandler();
    const fuzzers = trpc.fuzzer.fuzzers.useMutation({
        onError(error) {
            setAlert({
                msg: error.message,
                type: AlertEnum.error
            });
        },
        onSuccess(data) {
            setLen(data.length);
        }
    });


    const refresh = useCallback(() => {
        fuzzers.mutate({ pagination, search });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination, search]);

    const onSelect = (value: boolean, name: string) => {

        if (name === "all" && value) {
            setSelectedItems([...fuzzers.data?.map(e => e.name) ?? [], "all"]);
        } else if (name === "all" && !value) {
            setSelectedItems([]);
        } else if (name !== "all" && !value && selectedItems.includes("all")) {
            setSelectedItems(state => [...state.filter(e => e !== "all" && e !== name)]);
        } else {
            onSelectF(value, name);
        }

    }

    const onRemove = () => {
        if (confirm("Are you sure?")){
            onRemoveFuzzers(selectedItems, refresh);
            setSelectedItems([]);
        }
    }

    const onUpdate = (oldName: string) => {
        onChangeNameFuzzer(oldName, refresh);
        setSelectedItems([]);
    }

    const onCreate = () => {
        onCreateF(refresh);
    }

    const onSearch = () => {
        fuzzers.mutate({ pagination, search });
    }


    useEffect(() => {
        pagination.items > 0 && fuzzers.mutate({ pagination, search });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination]);

    return {
        onSearch,
        setSearch,
        search,
        pagination,
        next,
        prec,
        setLen,
        fuzzers,
        onSelect,
        selectedItems,
        onUpdate,
        onCreate,
        onRemove,
        refresh
    }


}