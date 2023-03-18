import { TextCtx } from "@/context/fuzzer/injection/text";
import { FC, HTMLAttributes, useContext } from "react";


const Text: FC = () => {

    const { set, text } = useContext(TextCtx);

    return (
        <textarea value={text} onChange={({ currentTarget: { value } }) => set(value)} className={`textarea textarea-bordered w-full resize-none h-52`}></textarea>
    );
}


export default Text;