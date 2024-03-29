import { ProfileCtx } from "@/context/user/profile";
import { SettingsCtx } from "@/context/user/settings";
import { ThemeContext } from "@/context/global/theme";
import { useSession } from "next-auth/react";
import Image from 'next/image';
import Link from "next/link";
import { FC, useContext } from "react";
import { AiOutlineDesktop } from "react-icons/ai";
import LogoImage from "@/../public/logo.svg";
import Logo from '@/components/svg/logo';
import { FaRobot } from "react-icons/fa";

export interface INavbarAuthenticated {
    name: string
    tapProfile: () => void
    tapSettings: () => void
}
// status components
export const NavbarAuthenticated: FC<INavbarAuthenticated> =
    ({ name, tapProfile, tapSettings }) => {

        return (
            <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar placeholder">
                    <div className="bg-neutral-focus text-neutral-content rounded-full w-10">
                        <FaRobot />
                    </div>
                </label>
                <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
                    <li onClick={tapProfile}>
                        <a className="justify-between">
                            Profile
                            <span className="badge">{name}</span>
                        </a>
                    </li>
                    <li onClick={tapSettings}><a>Settings</a></li>
                    <li><Link href="/api/auth/signout">Logout</Link></li>
                </ul>
            </div>
        );
    }


export interface INavBar { }

const NavBar: FC<INavBar> = () => {

    const { data: session, status } = useSession();
    const { onSwap, theme } = useContext(ThemeContext);

    const { onTap: tapProfile } = useContext(ProfileCtx);
    const { onTap: tapSettings } = useContext(SettingsCtx);

    const attributes = { tapProfile, tapSettings }; // prepare data attributes

    const tapTheme = () => {
        switch (theme) {
            case "dark":
                onSwap("light");
                break;
            case "light":
                onSwap("system");
                break;
            case "system":
                onSwap("dark")
                break;
            default:
                break;
        }
    }

    return (
        <div className="navbar bg-base-200 rounded-xl shadow-xl">
            <div className="navbar-start">
                <div className="dropdown">
                    <label tabIndex={0} className="btn btn-ghost btn-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                    </label>
                    <ul tabIndex={0} className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                        <li><Link href="/fuzzer">Homepage</Link></li>
                        <li><Link href="https://github.com/gianluca-caruso/PandP.fuzzer">About</Link></li>
                    </ul>
                </div>
            </div>
            <div className="navbar-center justify-center">
                <Link className="flex justify-center" href={"/"}>
                    <Logo
                        className=" fill-base-content stroke-base-content w-1/6"
                    />
                    <p className="self-end font-sans lowercase text-xs ">fuzzer</p>
                </Link>
            </div>
            <div className="navbar-end">
                <label className="swap swap-rotate swap-active">
                    <input
                        type="checkbox"
                        onClick={(e) => {
                            tapTheme();
                            e.stopPropagation();
                        }}
                    />
                    <svg className={`${theme === "dark" ? "swap-on" : "swap-off"} fill-current w-10 h-10" xmlns="http://www.w3.org/2000/svg`} viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" /></svg>
                    <svg className={`${theme === "light" ? "swap-on" : "swap-off"} fill-current w-10 h-10" xmlns="http://www.w3.org/2000/svg`} viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" /></svg>
                    <AiOutlineDesktop className={`${theme === "system" ? "swap-on" : "swap-off"} fill-current w-10 h-10`} />
                </label>
                {status === "authenticated" ?
                    <NavbarAuthenticated name={session.user.name} {...attributes} /> : <></>}
            </div>
        </div >
    )

}

export default NavBar;