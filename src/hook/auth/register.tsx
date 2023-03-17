import { AlertCtx } from "@/context/global/alert";
import { PasswordRegexError } from "@/utils/error";
import { UserValidator } from "@/model/user";
import { InputHTMLAttributes, useContext, useEffect, useState } from "react";
import { useForm, UseFormHandleSubmit, UseFormReset } from "react-hook-form";


export interface IUserRegister extends UserValidator {
    confirmPassword: string
};


export interface IUseCreateUser {
    //react-hook-form
    email: InputHTMLAttributes<HTMLInputElement>
    password: InputHTMLAttributes<HTMLInputElement>
    confirmPassword: InputHTMLAttributes<HTMLInputElement>
    name: InputHTMLAttributes<HTMLInputElement>
    //status check passwords
    isValidPassword: boolean
    //form
    handleSubmit: UseFormHandleSubmit<IUserRegister>
    onSubmit: (usr: IUserRegister) => Promise<void>
    reset: UseFormReset<IUserRegister>

}

export type CallbackUseCreateUser = (usr: UserValidator) => Promise<void>;

const useCreateUser = (cb: CallbackUseCreateUser): IUseCreateUser => {


    const [isValidPassword, setValidPassword] = useState<boolean>(true);

    const { register, watch, reset, handleSubmit, formState, control, setError } = useForm<IUserRegister>();
    // subscribe on password and confirmPassword
    const watchConfirmPassword = watch(["confirmPassword", "password"]);


    useEffect(() => {

        const [confirmPassword, password] = watchConfirmPassword;
        if (confirmPassword !== password && confirmPassword.length > 0) {
            setValidPassword(false);
        } else {
            setValidPassword(true)
        }

    }, [watchConfirmPassword]);

    const email = { ...register("email", { required: true }) };
    const password = { ...register("password", { required: true }) };
    const confirmPassword = { ...register("confirmPassword", { required: true }) };
    const name = { ...register("name", { minLength: 3, required: true }) };


    const onSubmit = async (user: IUserRegister): Promise<void> => {

        const validate = UserValidator
            .safeParse(user);

        if (validate.success) { // policy validate 
            const { data: user } = validate;

            if (isValidPassword) { // char or number duplicated
                await cb(user);
            } else {
                throw new Error(PasswordRegexError.charOrNumberDuplicated);
            }

        } else {
            const msg = validate.error.errors.map(e => e.message).join("\n");
            throw new Error(msg);
        }

    }


    return {
        reset,
        confirmPassword,
        email,
        isValidPassword,
        name,
        handleSubmit,
        onSubmit,
        password,
    };
}


export default useCreateUser;