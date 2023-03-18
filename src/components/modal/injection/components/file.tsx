import Alert, { AlertEnum } from "@/components/alert";
import { FileCtx } from "@/context/fuzzer/injection/file";
import { useAlert } from "@/hook/global";
import { ChangeEventHandler, FC, useCallback, useContext, useEffect, useRef } from "react";
import { BiTrash } from "react-icons/bi";



const File: FC = () => {

    const { set, clear } = useContext(FileCtx);
    const { setAlert } = useAlert();

    const onChange: ChangeEventHandler<HTMLInputElement> = useCallback(async (e) => {

        const { files } = e.currentTarget;

        if (files && files?.length > 0) {
            const f = files[0];
            setAlert({
                msg: `${f.name} has been successfully loaded`,
                type:AlertEnum.success
            });
            set(await f.text());
        }
    }, [set, setAlert]);


    const ref = useRef<HTMLInputElement>(null);

    const cleanInput = useCallback(() => {

        clear();
        if (ref.current) {
            ref.current.value = "";
        }

    }, [clear]);

    return (
        <div className="flex flex-row justify-start gap-2">
            <input type="file" className="file-input w-full max-w-xs file-input-bordered" defaultValue={""} {...{ onChange, ref }} />
            <button onClick={cleanInput} className="btn"><BiTrash /></button>
        </div>
    );
}


export default File;