import { IReactComponentChildren } from "@/context";
import { SettingsCtx } from "@/context/user/settings";
import { Theme, ThemeContext } from "@/context/global/theme";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { Router, useRouter } from "next/router";
import { FC, ReactNode, useEffect, useState } from "react";
import Breadcrumb from "../breadcrumb";
import ModalProfile from "../modal/profile";
import ModalSettings from "../modal/settings";
import NavBar from "../navbar";
import Footer from '@/components/footer';


export interface IContainer extends IReactComponentChildren {}

const Wrap: FC<IReactComponentChildren> = ({ children }) => {

    return (
        <div className="h-screen flex-col gap-2 m-2 p-2 pt-4 scrollbar-hide">
            {children}
        </div>
    )
};


const Container: FC<IContainer> = ({ children }) => {

    const { status } = useSession();

    return (
        <>
            <Head>
                <title>PandP | Fuzzer</title>
            </Head>
            <NavBar />
            <Wrap>
                <Breadcrumb />
                {children}
                {
                    status === "authenticated" ?
                        <>
                            <ModalProfile />
                            <ModalSettings />
                        </> :
                        <></>
                }
            </Wrap>
        </>
    )


}

export default Container;