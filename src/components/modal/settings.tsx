import { FuzzerCtx } from "@/context/fuzzer";
import { AlertCtx } from "@/context/global/alert";
import { SettingsCtx } from "@/context/user/settings";
import { useCheckConnection } from "@/hook/check.connection";
import { trpc } from "@/utils/trpc";
import { Settings } from "@prisma/client";
import { getCsrfToken } from "next-auth/react";
import { FC, forwardRef, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import ModalF, { Modal } from ".";
import { AlertEnum } from "../alert";
import Input from "../input/default";
import InputGroup from "../input/group";
import { TfiWorld } from "react-icons/tfi";
import Indicator from "../indicator";
import Zap from "../svg/zap";

export interface IModalSettings { }


const ModalSettings: FC<IModalSettings> = ({ }) => {

    const ctx = useContext(SettingsCtx);

    const { register, handleSubmit, watch, formState: { errors, isValid }, reset, getValues } = useForm<Settings>();

    const [checkConn, onCheckConn] = useCheckConnection();
    const trpcSettingsUpdate = trpc.setting.update.useMutation({
        onSuccess(data) {
            onCheckConn();
            data && setAlert({
                msg: "success, settings updated",
                type: AlertEnum.success
            });
        },
        onError(error) {
            setAlert({
                msg: error.message,
                type: AlertEnum.error
            });
        }
    });
    const trpcSettings = trpc.setting.settings.useQuery();

    const { setAlert } = useContext(AlertCtx);

    useEffect(() => {

        if (trpcSettings.status === "success" && trpcSettings.data) {
            const { apiKey, URLEndpoint } = trpcSettings.data;
            reset({ apiKey, URLEndpoint });
        }

    }, [reset, trpcSettings.data, trpcSettings.status])


    const onSubmit = async (settings: Settings) => {
        const { apiKey, URLEndpoint } = settings;
        await trpcSettingsUpdate.mutateAsync({ apiKey, URLEndpoint });
        //ctx.onTap();
    }

    //
    const apiKey = register("apiKey", { required: true, min: 2 });
    const URLEndpoint = register("URLEndpoint", { required: true });


    return (
        <>
            <Modal id="modal-settings" isOpen={ctx.isOpen} set={ctx.set} >
                <Modal.Title>Settings</Modal.Title>
                <Modal.Body className="gap-2 m-1 p-2 min-h-full">
                    <div className="flex flex-row justify-between gap-2">
                        <button className={`btn btn-ghost  btn-circle ${checkConn === null ? "loading" : ""}`}></button>
                        <div className="w-max self-center">
                            <Indicator>
                                <Indicator.Badge className="bg-transparent border-transparent">
                                    <div className={`self-center badge badge-xs
                                        ${checkConn ?
                                            "bg-green-500 border-green-700" : //true
                                            checkConn === null ?
                                                "bg-base-content border-base-content animate-pulse" : // null
                                                "bg-red-500 border-red-700"}` //false
                                    }>
                                    </div>
                                </Indicator.Badge>
                                <Zap className="w-full h-8" />
                            </Indicator>
                        </div>

                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="form-control gap-2">
                        <InputGroup
                            title="API key"
                            type="text"
                            placeholder="ApiKey#123"
                            {...apiKey}
                        />
                        <InputGroup
                            title="URL Endpoint"
                            type="url"
                            placeholder="http://localhost"
                            {...URLEndpoint}
                        />
                        <input type="submit" value={"save"} className="btn btn-primary" />
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ModalSettings;