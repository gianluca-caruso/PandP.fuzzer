import { AlertEnum } from "@/components/alert";
import Bg from "@/components/bg";
import InputRegister from "@/components/input/group/register";
import { AlertCtx } from "@/context/global/alert";
import useCreateUser, { CallbackUseCreateUser } from "@/hook/auth/register";
import { explainRegexPasswordStrong } from "@/utils/auth/password";
import { trpc } from "@/utils/trpc";
import { GetServerSideProps, NextPage } from "next";
import { getServerSession } from "next-auth";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useCallback, useContext } from "react";
import { authOptions } from "../api/auth/[...nextauth]";


export const getServerSideProps: GetServerSideProps = async (ctx) => {

    const session = await getServerSession(ctx.req, ctx.res, authOptions);


    if (session) {
        return {
            props: {},
            redirect: {
                destination: "/"
            },

        };
    } else {
        return { props: {} };
    }
}


const Register: NextPage<{ csrfToken: string }> = ({ csrfToken }) => {

    const { push } = useRouter(); // redirect

    const { setAlert } = useContext(AlertCtx);
    const trcpUser = trpc.user.create.useMutation();


    const cb: CallbackUseCreateUser = useCallback<CallbackUseCreateUser>(async (usr) => {

        try {
            const data = await trcpUser.mutateAsync(usr);

            if (data) {
                setAlert({
                    msg: "Success! Now you can sign in",
                    type: AlertEnum.success
                });
                const promise = Promise.resolve(setTimeout(() => {
                    push("/api/auth/signin")
                }, 2500));
                await promise;
            }


        } catch (error) {
            setAlert({
                msg: (error as Error).message,
                type: AlertEnum.error,
                ms: 1000 * 3

            });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setAlert]);

    const {
        confirmPassword,
        email,
        name,
        password,
        handleSubmit,
        onSubmit,
        reset,
        isValidPassword
    } = useCreateUser(cb);


    return (

        <div className="flex flex-col justify-center min-h-screen">
            <Bg />
            <div className="flex flex-row justify-between max-lg:flex-col w-full max-lg:justify-items-center">
                <div className="flex flex-row justify-center w-full">
                    <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100 basis-2/3">
                        <div className="card-body">
                            <form onSubmit={handleSubmit(onSubmit)} >
                                <InputRegister
                                    title={"Email"}
                                    {...{ ...email, type: "email" }} />
                                <InputRegister
                                    title={"username"}
                                    {...{ ...name, type: "text" }} />
                                <InputRegister
                                    title={"Password"}
                                    isValid={isValidPassword}
                                    type="password"
                                    {...password} />
                                <InputRegister
                                    title={"Confirm password"}
                                    isValid={isValidPassword}
                                    type="password"
                                    {...confirmPassword} />

                                <div className="form-control mt-6">
                                    <input type={"submit"} className="btn btn-primary" value="Register" />
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="flex flex-col text-center lg:text-left gap-1 p-2 basis-1/3">
                        <h1 className="text-5xl font-bold mb-4">Create new account now!</h1>
                        <p>the password: </p>
                        {explainRegexPasswordStrong
                            .map((e, idx) => <li className="pl-3" key={idx}>{e}</li>)}
                    </div>
                </div>
            </div>
        </div>
    );

}

export default Register;