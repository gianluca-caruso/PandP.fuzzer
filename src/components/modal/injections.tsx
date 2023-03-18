import { FuzzerCtx } from "@/context/fuzzer";
import { useInjection } from "@/hook/fuzzer/injection";
import { usePagination } from "@/hook/global";
import { useFuzzer } from "@/hook/reducer/fuzzer";
import { Injection } from "@/model/fuzz";
import { setInjections } from "@/reducer/features/fuzzer/fuzzer.slice";
import { trpc } from "@/utils/trpc";
import { FC, useContext, useEffect, useState } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import Modal from ".";
import PaginationComponent from "../pagination";
import SearchBar from "../search";
import Table from "../table";
import Tooltip from "../tooltip";
import EditModalInjection from "./injection/edit";

export interface IModalInjection { }


const ModalInjections: FC<IModalInjection> = () => {


    const { isOpenInjections, isOpenEditInjection, openEditInjection, openInjections } = useContext(FuzzerCtx);//modal controls
    const { state: { name }, removeInjection, updateReq } = useFuzzer(); //fuzzer
    const { next, pagination, prec, setLen } = usePagination(4); //pagination 
    const injections = trpc.fuzzer.injection.injections.useMutation({ onSuccess: (data) => Array.isArray(data) && setLen(data.length) });//trpc
    const { set: setGlobalInjection, clear, placeholder } = useInjection();

    const [_placeholder, setPlaceholder] = useState<string | null>("");

    useEffect(() => {
        pagination.items > 0 && name && injections.mutate({ name, pagination });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [name, pagination]);


    const onRemove = async (placeholder: string) => {

        if (!confirm("Are you sure ?")) {
            return;
        }
        await removeInjection(placeholder);
        // refresh
        await injections.mutateAsync({ name, pagination });
    }



    const onEdit = (injection: Injection) => {
        updateReq();
        setGlobalInjection(injection);
        setPlaceholder(injection.placeholder);
        openEditInjection(true);
    }

    useEffect(() => {
        !isOpenEditInjection && clear();
    }, [clear, isOpenEditInjection]);


    const [search, setSearch] = useState<string>("");

    return (
        <>
            <Modal id="modal-injections" isOpen={isOpenInjections} set={openInjections} className="min-w-max">
                <Modal.Title>injections</Modal.Title>
                <Modal.Body className="overflow-auto scrollbar-hide h-[300px] w-max">
                    <SearchBar className="focus-within:bg-base-300 w-max">
                        <SearchBar.Button onClick={() => injections.mutate({ name, pagination, search })} />
                        <SearchBar.Input value={search} className="focus:bg-base-300 w-max" onChange={({ currentTarget: { value } }) => setSearch(value)} />
                    </SearchBar>
                    <Table className="w-max min-w-[300px]">
                        <thead>
                            <tr>
                                <th>placeholder</th>
                                <th>occurences</th>
                                <th>regex</th>
                                <th>text</th>
                                <th>file</th>
                                <th>len</th>
                                <th>options</th>
                            </tr>
                        </thead>
                        <tbody>
                            {injections.data?.map((e, idx) => {

                                const { file, occurrences, payload, placeholder, regex, text, id } = e;

                                return (
                                    <tr key={idx}>
                                        <td>{placeholder}</td>
                                        <td>{occurrences.includes(-1) ? "all" : occurrences.sort((a, b) => b - a)[0]}</td>
                                        <td>
                                            <input type={"checkbox"} className="checkbox" disabled defaultChecked={!!regex} />
                                        </td>
                                        <td>
                                            <input type={"checkbox"} className="checkbox" disabled defaultChecked={!!text} />
                                        </td>
                                        <td>
                                            <input type={"checkbox"} className="checkbox" disabled defaultChecked={!!file} />
                                        </td>
                                        <td>{payload.length}</td>
                                        <td>
                                            <div className="flex flex-row ">
                                                <Tooltip content="edit">
                                                    <button className="btn rounded-2xl btn-ghost" onClick={() => onEdit(e)}>
                                                        <FiEdit2 />
                                                    </button>
                                                </Tooltip>
                                                <Tooltip content={"remove"} >
                                                    <button className="btn rounded-2xl btn-ghost" onClick={() => onRemove(placeholder)}>
                                                        <FiTrash2 />
                                                    </button>
                                                </Tooltip>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            }
                            )}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Actions className="flex flex-row gap-2 justify-between">
                    <PaginationComponent pagination={pagination} nextPage={next} precPage={prec} />
                </Modal.Actions>
            </Modal>
            {isOpenEditInjection && _placeholder ?
                <EditModalInjection
                    _cb={() => {
                        injections.mutate({ name, pagination, search });
                        setPlaceholder(null);
                    }}
                    placeholder={_placeholder} />
                :
                <></>
            }
        </>
    );
}

export default ModalInjections;