import { PasswordRegexError } from "@/utils/error";
import { TRPCError } from "@trpc/server";
import { prismaExec } from "../prisma";
import { checkPassword } from "./credentials";

//regex
export const regexPasswordStrong = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*(\.|,|\?|\;\:\!)).{8,20}$/gm;
export const regexFindDuplicated = /(.+)\1+/;


export const getStatusIsSecurePassword = (password: string): boolean => {

    if (regexFindDuplicated.test(password)) {
        throw Error(PasswordRegexError.charOrNumberDuplicated);
    } else {
        if (!regexPasswordStrong.test(password)) {
            throw Error(PasswordRegexError.policyRequirements);
        }
        return true;
    }
}

export const explainRegexPasswordStrong = [
    "must has at least 8 characters",
    "must include at least one upper case letter",
    "must include one lower case letter",
    "must include one numeric digit",
    "can't include characters or numbers duplicated"
];
