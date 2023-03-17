import Har, { EntriesEntity, Request as RequestHar } from "@/model/har";
import { IReactComponentChildren } from "@/context";
import { createContext, FC, useCallback, useContext, useEffect, useState } from "react";
import { Pagination } from "@/model/pagination";
import { harRequestToRaw, MessageHarEnum, SearchHarEnum } from "@/utils/zap/har";
import { trpc } from "@/utils/trpc";
import { AlertCtx } from "../global/alert";
import { AlertEnum } from "@/components/alert";
import { FuzzerCtx } from ".";
import { Fuzzer as IFuzzer } from "@/model/fuzz";
import { isZapError, validateChangeRequest } from "@/utils/zap";
import { useAlert } from "@/hook/global";
import { useFuzzer } from "@/hook/reducer/fuzzer";

export interface SearchHar {
    search: string
    by: SearchHarEnum
}


export interface IHarCtx {
    // har
    har: Har | null,
    set: (har: Har | null) => void,
    // select req 
    select: EntriesEntity | null,
    setSelect: (harId: number | null) => void
    getSelect: () => RequestHar | null,
    // pagination
    paginationHar: Pagination,
    setPaginationHar: (pag: Partial<Pagination>) => void
    //search
    searchHar: SearchHar,
    setSearchHar: (search: Partial<SearchHar>) => void,
    // execute
    executeSearchHar: () => void
}


export const HarCtx = createContext<IHarCtx>({
    har: null,
    set(har) { },
    select: null,
    setSelect(harId) { },
    setPaginationHar(pag) { },
    getSelect() { return null; },
    setSearchHar(search) { },
    paginationHar: {
        items: 4,
        page: 0
    },
    searchHar: { search: "", by: SearchHarEnum.byUrl },
    executeSearchHar() { }
});


const HarProvider: FC<IReactComponentChildren> = ({ children }) => {

    const [har, setHar] = useState<Har | null>(null);
    const [select, setSelect] = useState<EntriesEntity | null>(null);
    const [pagination, setPagination] = useState<Pagination>({ items: 4, page: 0 });
    const [search, setSearch] = useState<SearchHar>({ by: SearchHarEnum.byUrl, search: "" });

    const searchHar = trpc.har.search.useMutation({
        onSuccess(data) {
            if (isZapError(data)) {
                setAlert({
                    msg: data.message,
                    type: AlertEnum.error
                });
            }
            setHar(data as Har);
        },
        onError(err) {
            setHar(null);
            setAlert({
                msg: err.message + " har requests",
                type: AlertEnum.error
            });
        }
    });

    const { setAlert } = useAlert();

    useEffect(() => {
        searchHar.mutate({ pagination: { items: 4, page: 0 }, by: SearchHarEnum.byUrl });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const executeSearchHar = useCallback((pag?: Pagination) => {

        const data = {
            ids: search.by === SearchHarEnum.byId ? parseInt(search.search) : undefined,
            url: search.by === SearchHarEnum.byUrl ? search : undefined,
            search: search.search,
            by: search.by,
            pagination: pag ?? pagination
        };

        searchHar.mutate(data);
    }, [pagination, search, searchHar]);

    const { setRawReq, updateReq, state: { injections } } = useFuzzer();

    return (
        <HarCtx.Provider value={{
            executeSearchHar,
            har,
            set(har) {
                setHar(har);
            },
            select,
            setSelect(harId) {

                if (!harId) {
                    setSelect(null);
                } else {

                    if (!har) {
                        throw new Error("the har is null");
                    }

                    const entry = har.log?.entries?.find(e => e._zapMessageId === harId);

                    if (!entry) {
                        throw new Error(`not found _zapMessageId equals ${harId} in har`);
                    }

                    const req = harRequestToRaw(entry.request);
                    const invalidInjections = validateChangeRequest(req, injections);


                    if (invalidInjections.length > 0 && !confirm("Are you sure? Any injections do not match the request and will be removed")) {
                        return;
                    }
                    updateReq(invalidInjections, req);
                    setSelect(entry);
                }
            },
            paginationHar: pagination,
            setPaginationHar(pag) {
                executeSearchHar({ ...pagination, ...pag });
                setPagination((state) => ({ ...state, ...pag }));
            },
            getSelect() {

                if (!select) {
                    throw new Error("no request is selected");
                }

                return select?.request;
            },
            searchHar: search,
            setSearchHar(searchIn) {
                setSearch(state => ({ ...state, ...searchIn }));
            }
        }}>
            {children}
        </HarCtx.Provider>
    )
}

export default HarProvider;