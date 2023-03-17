import PaginationComponent from "@/components/pagination";
import { HarCtx } from "@/context/fuzzer/har";
import { Pagination } from "@/model/pagination";
import { trpc } from "@/utils/trpc";
import { FC, useContext } from "react";
import { useState } from "react";
import { TableDrawerHar } from "./table";


const Har: FC = () => {


    const { paginationHar, setPaginationHar, har, executeSearchHar } = useContext(HarCtx);


    return (
        <div className="flex flex-col gap-2 w-full h-full min-h-full">
            <div className="h-3/2 w-full overflow-auto scrollbar-hide max-h-[500px] min-h-[300px]">
                <TableDrawerHar />
            </div>
            <div>
                <PaginationComponent
                    pagination={paginationHar}
                    nextPage={(page) => {
                        if (har?.log?.entries?.length === 0) {
                            setPaginationHar({ stop: true });
                        }
                        else if (!paginationHar.stop) {
                            setPaginationHar({ page });
                        }
                    }}
                    precPage={(page) => {

                        if (page >= 0 && page !== paginationHar.page) {
                            setPaginationHar({ page, stop: false });
                        }
                    }}
                />
            </div>
        </div>
    )
}

export default Har;