import Dropdown from "@/components/dropdown";
import Table from "@/components/table";
import { HarCtx } from "@/context/fuzzer/har";
import { Response } from "@/model/har";
import { extractItemForTable } from "@/utils/zap/har";
import { randomUUID } from "crypto";
import { FC, useContext } from "react";


export interface ITableDrawerFuzzer { }

export const TableDrawerHar: FC<ITableDrawerFuzzer> = ({ }) => {


    const { har, select, setSelect } = useContext(HarCtx);
    const hars = har && har.log && har.log.entries ? har.log.entries : [];




    return (
        <Table className="w-full">
            <thead>
                <tr className="sticky top-0 z-50">
                    <th>id</th>
                    <th>target</th>
                    <th>method</th>
                    <th>pathname</th>
                    <th>params</th>
                    <th>time</th>
                    <th>sent</th>
                    <th>status</th>
                    <th className="text-center">cookie</th>
                    <th>http version</th>
                </tr>
            </thead>
            <tbody>
                {hars.map((e) => {
                    const { cookies, httpVersion, id, method, statusText,
                        pathname, sent, status, target, time, params, url } = extractItemForTable(e)
                    return (
                        <tr
                            key={`${id}-${target}`}
                            className={`cursor-pointer ${select?._zapMessageId === id ? "active" : ""}`}
                            onDoubleClick={() => {
                                select?._zapMessageId === id ? setSelect(null) : setSelect(id ?? -1);
                            }}>
                            <td>{id}</td>
                            <td>{target}</td>
                            <td>{method}</td>
                            <td>{pathname}</td>
                            <td>
                                <Dropdown className="dropdown-hover w-max">
                                    <button tabIndex={0} className="btn btn-sm btn-wide">{params.length} items</button>
                                    <Dropdown.List className="w-full max-h-40">
                                        <div className="overflow-auto w-full">
                                            {params.map(param => {
                                                return (
                                                    <div
                                                        key={`${id}-${url}-${param[0]}`}
                                                        className="flex flex-row justify-between p-2 w-full gap-2">
                                                        <div className="max-w-sm overflow-auto">
                                                            <p>{param[0]}</p>
                                                        </div>
                                                        <span className="badge self-center">
                                                            <p>{param[1]}</p>
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </Dropdown.List>
                                </Dropdown>
                            </td>
                            <td>{time} ms</td>
                            <td>{sent}</td>
                            <td>{status} {statusText}</td>
                            <td>
                                <div className="flex w-full flex-col items-center">
                                    <input type="checkbox" className="checkbox" disabled defaultChecked={cookies && cookies.length > 0} />
                                </div>
                            </td>
                            <td>{httpVersion}</td>
                        </tr>
                    )
                })}
            </tbody>
        </Table >
    )
};
