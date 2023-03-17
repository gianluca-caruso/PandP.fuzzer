import { Pagination } from "@/model/pagination";
import { FC } from "react"

export interface IPagination {
    pagination: Pagination
    nextPage: (page: number) => void
    precPage: (page: number) => void
}

const PaginationC: FC<IPagination> = ({ pagination, nextPage, precPage }) => {

    const { page, stop } = pagination;

    return (
        <div className="btn-group">
            <button className="btn" onClick={() => precPage(page - 1 <= 0 ? 0 : page - 1)}>«</button>
            <button className="btn">Page {page}</button>
            <button className="btn" onClick={() => stop ? null : nextPage(page + 1)}>»</button>
        </div >
    )
}

export default PaginationC;