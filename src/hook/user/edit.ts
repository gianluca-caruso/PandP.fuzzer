import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useAlert } from "@/hook/global";
import { AlertEnum } from "../../components/alert";
import { trpc } from "../../utils/trpc";
import { signOut } from "next-auth/react";
import { PasswordError } from "@/utils/error";
import { EmailValidator, PasswordValidator } from "@/model/user";

// hook
export interface IFormProfile {
    name: string
    email: string
    password: string
    confirmPassword: string
    pass: string
}

const useEditProfile = () => {

    /* router */
    const { reload } = useRouter();
    const onError = useCallback((err: { message: string }) => {
        setAlert({ msg: err.message, type: AlertEnum.error });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { reset, register, formState: { errors, isValid }, getValues, handleSubmit } = useForm<IFormProfile>();
    const { setAlert } = useAlert();
    const select = trpc.user.select.useQuery(undefined, { onError });
    const update = trpc.user.update.useMutation({
        onError,
        onSuccess(data) {
            setAlert({ msg: "the user has been modified", type: AlertEnum.success });
            //reload();
        }
    });
    const deleteUser = trpc.user.delete.useMutation({
        onError,
        onSuccess(data) {
            setAlert({ msg: "the user has been deleted", type: AlertEnum.warning });
            reload();
        }
    });

    useEffect(() => {

        if (select.data) {
            const { email, name } = select.data;
            reset({ name, email });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [select.data, select.isSuccess])


    const onDeleteUser = async () => {
        const { pass } = getValues();
        if (pass.length > 0) {
            deleteUser.mutate(pass);
            signOut();
        } else {
            setAlert({ msg: "the password is empty", type: AlertEnum.error });
        }

    }

    const onSubmit = async (state: IFormProfile) => {

        const { confirmPassword, email, name, password, pass } = getValues();
        if (password.length > 0 && confirmPassword.length > 0) {
            if (password !== confirmPassword) {
                setAlert({
                    msg: PasswordError.samePassword,
                    type: AlertEnum.error
                });
                return;
            }

            const pass = PasswordValidator.safeParse(password);
            if (!pass.success) {
                const msg = pass.error.errors.map(e => e.message).join("\n");
                setAlert({ msg, type: AlertEnum.error });
                return;
            }
        }

        if (email.length > 0) {
            const emailV = EmailValidator.safeParse(email);
            if (!emailV.success) {
                const msg = emailV.error.errors.map(e => e.message).join("\n");
                setAlert({ msg, type: AlertEnum.error });
                return;
            }
        }


        if (pass.length > 0) {
            const data = {
                user: {
                    email: email.length > 0 ? email : undefined,
                    name: name.length > 0 ? name : undefined,
                    password: password.length > 0 ? password : undefined,
                }, password: pass
            };
            update.mutate(data);
        } else {
            setAlert({ msg: "the password is empty", type: AlertEnum.error });
        }

    }

    return {
        register,
        handleForm: handleSubmit(onSubmit),
        status: select.status,
        onDeleteUser
    }
}

export default useEditProfile;