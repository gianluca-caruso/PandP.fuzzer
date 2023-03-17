import { GetServerSideProps, InferGetServerSidePropsType, NextPage, NextPageContext } from "next";
import Image from 'next/image';
import ErrorImage from 'public/error.png';
import Error from 'next/error'
import { number } from "zod";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Link from "next/link";

interface Props {
    statusCode: number | undefined
    statusMessage: string | undefined
}


const ErrorPage: NextPage<Props> = ({ statusCode, statusMessage }) => {


    return (
        <div className="w-full justify-center flex flex-col min-h-screen">
            <div className="flex flex-col justify-center bg-base-300 rounded-3xl shadow-xl w-[40%] self-center p-10 gap-2">
                <div className="flex flex-row justify-center items-center w-1/2 self-center">
                    <Image src={ErrorImage} alt={"error"} className="w-3/4" />
                </div>
                <p className="font-sans text-4xl text-center font-semibold">{statusCode} <span className="text-2xl font-normal uppercase">{statusMessage}</span></p>
                <div className="text-center">
                    <p className="text-md text-base-content font-normal">The server cannot process your request.</p>
                    <p className="text-md text-base-content font-normal">If the problem persists, please contact the site owner.</p>
                </div>
                <button className="btn btn-warning rounded-3xl btn-wide self-center"><Link href={"/"}>Got It</Link></button>
            </div>
        </div>
    )
};

ErrorPage.getInitialProps = ({ res, err }) => {

    const statusCode = err?.statusCode ?? res?.statusCode ?? err?.statusCode ?? undefined;
    if (res && statusCode) {
        res.statusCode = statusCode;
    }
    const statusMessage = String(res?.statusMessage || err?.message || err) ?? statusCode === 404 ? "Not Found" : "";

    return { statusCode, statusMessage };
};





export default ErrorPage;