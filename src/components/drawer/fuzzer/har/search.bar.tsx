import Alert, { AlertEnum } from "@/components/alert";
import SearchBar from "@/components/search";
import { HarCtx } from "@/context/fuzzer/har";
import { AlertCtx } from "@/context/global/alert";
import { trpc } from "@/utils/trpc";
import { MessageHarEnum, SearchHarEnum } from "@/utils/zap/har";
import { useCallback, useContext, useEffect } from "react";
import { useState } from "react";
import { FC } from "react";
import { AiFillFilter } from "react-icons/ai";

interface ISearchHarBy {
    by: SearchHarEnum
    setSearchHar: (data: { by: SearchHarEnum }) => void
}

const SearchHarBy: FC<ISearchHarBy> = ({ by, setSearchHar }) => {

    return (
        <select
            className="select basis-1/3 focus:outline-none bg-base-100"
            value={by}
            onChange={({ currentTarget }) => {
                const option = currentTarget.options.item(currentTarget.selectedIndex);
                if (option) {
                    const by = option.value as unknown as SearchHarEnum;
                    by && setSearchHar({ by });
                }
            }}
        >
            <option value={undefined} disabled className="font-semibold bg-base-200">search by</option>
            <option value={SearchHarEnum.byUrl} >base url</option>
            <option value={SearchHarEnum.byId} >id</option>
            <option value={SearchHarEnum.byHeaderRegex} >header - regex</option>
            <option value={SearchHarEnum.byRequestRegex} >request - regex</option>
            <option value={SearchHarEnum.byUrlRegex} >url - regex</option>
            <option value={SearchHarEnum.byResponseRegex} >response - regex</option>
        </select>
    )
}

const SearchBarHar: FC = () => {

    const { har: hars, set, paginationHar, searchHar, setSearchHar, executeSearchHar, setPaginationHar } = useContext(HarCtx);


    const onHar = () => {
        //something
        executeSearchHar();
        setPaginationHar({ page: 0 });
    }


    return (
        <SearchBar>
            <SearchBar.Button onClick={onHar} />
            <SearchBar.Input
                placeholder="Type here"
                value={searchHar.search}
                onChange={({ currentTarget: { value } }) => setSearchHar({ search: value })} />
            <SearchHarBy by={searchHar.by} setSearchHar={setSearchHar} />
        </SearchBar>
    )
}

export default SearchBarHar;