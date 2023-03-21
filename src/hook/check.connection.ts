import { useEffect, useState, useContext } from "react";
import { trpc } from '@/utils/trpc';
import { useFormContext } from "react-hook-form";
import { AlertCtx } from "@/context/global/alert";
import { AlertEnum } from "@/components/alert";




export const useCheckConnection = (): [isConn: boolean | null, onClick: () => void] => {

    const [isConn, setIsConn] = useState<boolean | null>(false);

    const { setAlert } = useContext(AlertCtx);

    const query = trpc.setting.checkConn.useQuery(undefined, {
        enabled: false,
        onSuccess(data) {
            setIsConn(data);
            if (data){
                setAlert({
                    msg: "successful connection",
                    type: AlertEnum.info
                });
            }else{
                setAlert({
                    msg: "error connection",
                    type: AlertEnum.error
                });
            }
        },
        onError(err) {
            setAlert({
                msg: "error connection",
                type: AlertEnum.error
            });
            setIsConn(false);
        },
    });

    const onClick = () => {

        setIsConn(null);
        query.refetch();
    }


    return [isConn, onClick];
}

