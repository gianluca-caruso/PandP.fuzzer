import Link from "next/link"
import CreateAccount from "public/register/create-account.png";
import SignIn from 'public/register/sign-in.png';
import Logo from 'public/zap.svg';
import Image from "next/image";
import Bg from "../bg";
import Footer from "../footer";




const Auth = () => (

    <div className="flex flex-col items-center mt-32 gap-10  min-h-screen">
        <div className="flex flex-row justify-center bg-base-300 rounded-3xl shadow-2xl w-1/2 h-1/2 p-10" >
            <div className="w-2/3 flex flex-col justify-center">
                <div className="flex flex-col justify-center items-center gap-2">
                    <Image src={CreateAccount} alt={"create-account"} className="w-[50%] self-center " />
                    <Link className="btn w-3/4" href={"/auth/register"}>Create Account</Link>
                </div>
                <div className="divider">OR</div>
                <div className="flex flex-col justify-center items-center gap-2">
                    <Link className="btn w-3/4" href="/api/auth/signin">Sign In</Link>
                    <Image src={SignIn} alt={"sign-in"} className="w-[20%] self-center" />
                </div>
            </div>
        </div>
        
    </div>
)

export default Auth;