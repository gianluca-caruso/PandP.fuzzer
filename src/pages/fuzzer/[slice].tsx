import BottomDrawerFuzzer from "@/components/drawer/fuzzer";
import { FuzzerComponents } from "@/components/fuzzer";
import FuzzerMenu from "@/components/menu/fuzzer";
import RequestFuzzer from "@/components/mockup/fuzzer";
import ResponseFuzzer from "@/components/mockup/fuzzer/response";
import { CreateModalInjection } from "@/components/modal/injection/injection";
import ModalInjections from "@/components/modal/injections";
import { FuzzerCtx, WrapFuzzer } from "@/context/fuzzer";
import { useFuzzer } from "@/hook/reducer/fuzzer";
import { useRespFuzzer } from "@/hook/reducer/fuzzer/response";
import { Fuzzer as IFuzzer } from "@/model/fuzz";
import { parseInjections } from "@/utils/db/fuzzer";
import { prismaExec } from "@/utils/prisma";
import { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";
import { FC, useCallback, useContext, useEffect } from "react";
import { authOptions } from "../api/auth/[...nextauth]";




export const getServerSideProps: GetServerSideProps = async (ctx) => {


    const session = await getServerSession(ctx.req, ctx.res, authOptions);

    if (session && ctx.params && ctx.params.slice && typeof ctx.params.slice === "string") {
        const { slice } = ctx.params;
        const { email } = session.user;

        const data = await prismaExec(prisma => prisma.fuzz.findFirst({ where: { name: slice, User: { email } }, include: { injections: true } }));

        if (data) {
            const injections = data?.injections && Array.isArray(data.injections) && data.injections.length > 0 ? parseInjections(data.injections) : [];

            const fuzzer: IFuzzer = {
                ...data,
                createdAt: data.createdAt.toLocaleString(),
                updatedAt: data.updatedAt.toLocaleString(),
                injections
            };

            return { props: { fuzzer } };
        }
    }


    return {
        redirect: {
            destination: '/',
            permanent: true,
        }
    };
}


interface Props {
    fuzzer: IFuzzer
}

const Fuzzer: NextPage<Props> = ({ fuzzer }) => {

    const { setState } = useFuzzer();
    const { clear } = useRespFuzzer();
    const { isOpenHarFuzzer, isOpenInjection, isOpenInjections } = useContext(FuzzerCtx);


    useEffect(() => {
        fuzzer && clear() && setState(fuzzer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fuzzer]);

    return (
        <WrapFuzzer>
            <div className="flex felx-row justify-center gap-2 max-lg:min-h-screen lg:h-4/5  max-lg:flex-col w-full p-2">
                <div className="flex w-[47%] max-lg:min-h-screen">
                    <RequestFuzzer />
                </div>
                <div className="flex flex-col lg:max-w-fit max-lg:w-full max-lg:flex-row h-full z-50 justify-center">
                    <FuzzerMenu />
                </div>
                <div className="flex w-[47%] max-lg:min-h-screen">
                    <ResponseFuzzer />
                </div>
            </div>
            <FuzzerComponents />
        </WrapFuzzer>
    );
};



export default Fuzzer;