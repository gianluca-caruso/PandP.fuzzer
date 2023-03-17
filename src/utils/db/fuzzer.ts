import { extractPayload } from "@/reducer/features/fuzzer/fuzzer.slice";
import { Injection } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { prismaExec } from "../prisma"
import {Injection as InjectionModel} from '@/model/fuzz';

// todo: refactoring
//error
export const ERROR_ALREADY_EXISTS_FUZZER = new TRPCError({ code: "BAD_REQUEST", message: "the fuzzer have already exists" });
export const ERROR_ALREADY_EXISTS_INJECTION = new TRPCError({ code: "BAD_REQUEST", message: "the injection have already exists" });
export const ERORR_NOT_EXISTS_FUZZER = new TRPCError({ code: "BAD_REQUEST", message: "the fuzzer doesn't exist" });
export const ERORR_NOT_EXISTS_FUZZERS = new TRPCError({ code: "BAD_REQUEST", message: "a few fuzzers don't exist" });
export const ERORR_NOT_EXISTS_INJECTION = new TRPCError({ code: "BAD_REQUEST", message: "the injection doesn't exist" });

// utils
export const alreadyExistsFuzzer = async (email: string, name: string) =>
    !!await prismaExec(prisma => prisma.fuzz.findFirst({ where: { AND: { name, User: { email } } } }))

export const alreadyExistsInjection = async (email: string, name: string, placeholder?: string, id?: number) => {

    if (!placeholder && !id) {
        throw new Error("placeholder and id undefined");
    }

    if (!(await alreadyExistsFuzzer(email, name))) {
        throw ERORR_NOT_EXISTS_FUZZER;
    }

    const whereInjection = id && !placeholder ? { id } : { placeholder };

    const data = await prismaExec(prisma => prisma.injection.findFirst({
        where: { ...whereInjection, Fuzz: { name, User: { email } } }
    }));

    return !!data;
}

export const parseInjection = (e: Injection) => {

    const injection: InjectionModel = {
        ...e,
        occurrences: e.occurrences ? JSON.parse(e.occurrences) : [],
        payload: []
    };

    injection.payload = extractPayload(injection);
    return injection;
}

export const parseInjections = (data: Injection[]): InjectionModel[] => data.map((e) => parseInjection(e));

export const selectFuzzerByUserEmailAndName = async (userEmail: string, name: string) => {
    const data = await prismaExec(prisma => prisma.fuzz.findFirst({ where: { AND: { userEmail, name } } }));
    return data;
}