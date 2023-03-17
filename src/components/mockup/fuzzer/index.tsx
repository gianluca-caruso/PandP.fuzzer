import Toolltip from "@/components/tooltip";
import { useFuzzer } from "@/hook/reducer/fuzzer";
import { validateChangeRequest } from "@/utils/zap";
import { ChangeEventHandler, FC } from "react";
import { AiOutlineClear, AiOutlineSave } from "react-icons/ai";
import Mockup, { Actions, IMockup } from "..";


const RequestFuzzer: FC = ({ }) => {

    const { state, setRawReq, updateReq, resetReq } = useFuzzer();

    const onSave = () => {
        const invalidInjections = validateChangeRequest(state.rawRequest, state.injections);
        if (invalidInjections.length > 0) {
            if (confirm("Are you sure? since some injections are not included in the request, these will be removed.")) {
                updateReq(invalidInjections);
            }
        } else {
            updateReq();
        }
    }

    const onClear = () => {
        if (confirm("Are you sure?")) {
            resetReq();
        }
    }

    return (
        <Mockup title="REQUEST">
            <div className="flex flex-row justify-center w-full h-[85%] overflow-auto">
                <textarea
                    value={state.rawRequest}
                    onChange={({ currentTarget: { value } }) => setRawReq(value)}
                    className="text-base whitespace-nowrap font-mono focus:outline-none outline-none bg-inherit textarea resize-none w-full m-2" spellCheck={false} >
                </textarea>
            </div>
            <Mockup.Actions className="justify-end gap-2 tooltip-left">
                <Actions.Button className="tooltip-success" data-tip="save request" onClick={onSave}>
                    <AiOutlineSave />
                </Actions.Button>
                <Actions.Button className="tooltip-warning" data-tip="clear request" onClick={onClear}>
                    <AiOutlineClear />
                </Actions.Button>
            </Mockup.Actions>
        </Mockup>
    );
}

export default RequestFuzzer;