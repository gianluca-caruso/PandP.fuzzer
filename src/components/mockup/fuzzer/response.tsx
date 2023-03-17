import { useRespFuzzer } from "@/hook/reducer/fuzzer/response";
import { IResponseFuzzer } from "@/reducer/features/fuzzer/response.slice";
import { FC } from "react";
import { AiOutlineClear } from "react-icons/ai";
import Mockup, { Actions } from "..";


const RenderMsgs = ({ queue }: IResponseFuzzer) => {

    return (
        <>
            {queue.map(({ msg, type, createdAt }, idx) => {

                
                let className: string = "text-inherit";

                switch (type) {
                    case "error":
                        className = "text-error";
                        break;
                    case "info":
                        className = "text-info";
                        break;
                    case "success":
                        className = "text-success";
                        break;
                    case "warning":
                        className = "text-warning";
                        break;

                }

                return (
                    <div key={idx} className="flex flex-row gap-1 justify-between">
                        <pre data-prefix="~" className={className}>
                            <code>{msg}</code>
                        </pre>
                        <pre className="text-inherit text-sm">
                            <code>{createdAt}</code>
                        </pre>
                    </div>
                );
            })}
        </>
    )


}

const ResponseFuzzer: FC = () => {

    const { queue, clear } = useRespFuzzer();

    return (
        <Mockup title={"RESPONSE"}>
            <div className="flex flex-col h-full w-full">
                <div className="pt-3 overflow-auto h-[80%]">
                    <RenderMsgs queue={queue} />
                </div>
                <Mockup.Actions className="justify-end">
                    <Actions.Button className="tooltip-warning" data-tip="clear response" onClick={clear}>
                        <AiOutlineClear />
                    </Actions.Button>
                </Mockup.Actions>
            </div>
        </Mockup>
    )
};

export default ResponseFuzzer;