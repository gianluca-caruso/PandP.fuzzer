import InputF from "@/components/input/default";
import { HMenu, MenuItem } from "@/components/menu";
import { RegexCtx } from "@/context/fuzzer/injection/regex";
import { generateRegex } from "@/utils/regex";
import { FC, useContext } from "react";
import { FiPlay } from "react-icons/fi";
import { RxReset } from "react-icons/rx";
import { expandN } from 'regex-to-strings';
import { expandAll } from "regex-to-strings/lib/pattern";


export interface IRegex { }

const Regex: FC<IRegex> = () => {

    const { clearOutput, output, regex, set, generate } = useContext(RegexCtx);



    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 w-full">
                {/* input regex  */}
                <div className="form-control basis-4/6">
                    <InputF
                        title="regex"
                        className="w-full"
                        onChange={({ currentTarget: { value } }) => set({ regex: value, size: regex.size })}
                        value={regex.regex}
                    />
                </div>
                {/* nsize */}
                <div className="form-control basis-3/12">
                    <InputF
                        title="size"
                        type={"number"}
                        className="w-full"
                        onChange={({ currentTarget: { valueAsNumber } }) => set({ size: valueAsNumber, regex: regex.regex })}
                        value={`${regex.size}`}
                    />

                </div>
                {/* menu */}
                <div className="flex flex-row justify-center basis-2/6 self-end">
                    <HMenu>
                        <MenuItem onClick={() => generate(generateRegex(regex))} tooltip="generator"><FiPlay /></MenuItem>
                        <MenuItem onClick={clearOutput} tooltip="reset"><RxReset /></MenuItem>
                    </HMenu>
                </div>
            </div>
            {/* cols */}
            <textarea className="textarea textarea-bordered resize-none h-52" readOnly value={output}></textarea>
        </div>
    )
};

export default Regex;