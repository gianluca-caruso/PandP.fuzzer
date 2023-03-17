import PaginationComponent from "@/components/pagination";
import SearchBar from "@/components/search";
import { FuzzerCtx } from "@/context/fuzzer";
import { HarCtx } from "@/context/fuzzer/har";
import { FC, useContext, useState } from "react";
import Tab from "../../tab";
import BottomDrawer from "../bottom";
import Har from "./har";
import SearchBarHar from "./har/search.bar";
import { TableDrawerHar } from "./har/table";




export interface IBottomDrawerFuzzer { }

const BottomDrawerFuzzer: FC<IBottomDrawerFuzzer> = ({ }) => {

    const { isOpenHarFuzzer, openHarFuzzer } = useContext(FuzzerCtx);

    return (
        <BottomDrawer isOpen={isOpenHarFuzzer} onTap={openHarFuzzer}>

            <div className="flex flex-wrap w-full gap-2 justify-between">
                <Tab className="w-max p-2 order-last h-min self-end">
                    <Tab.Item active>hars</Tab.Item>
                </Tab>
                <SearchBarHar />
            </div>
            <Har />
        </BottomDrawer>
    )
}

export default BottomDrawerFuzzer;