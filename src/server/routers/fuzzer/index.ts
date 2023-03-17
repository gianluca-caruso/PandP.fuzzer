import { FuzzerNamesValidator, FuzzerNameValidator, FuzzerValidator, InjectionPlaceholdersValidator, RawRequestValidator } from "@/model/fuzz";
import { Pagination } from "@/model/pagination";
import { privateProcedure, router } from "@/server/trpc";
import { alreadyExistsFuzzer, ERORR_NOT_EXISTS_FUZZER, ERORR_NOT_EXISTS_FUZZERS, ERROR_ALREADY_EXISTS_FUZZER, parseInjections } from "@/utils/db/fuzzer";
import { invalid_type, invalid_type_string, invalid_type_string_array, required_error } from "@/utils/error";
import { prismaExec } from "@/utils/prisma";
import z from 'zod';
import { injectionRouter } from "./injection";
import { scriptRouter } from "./script";


// router
export const fuzzerRouter = router({

    changeFuzzerName: privateProcedure
        .input(z.object({ oldNameFuzzer: FuzzerNameValidator, newNameFuzzer: FuzzerNameValidator }))
        .mutation(async ({ ctx: { email }, input: { newNameFuzzer, oldNameFuzzer } }) => {

            if (await alreadyExistsFuzzer(email, newNameFuzzer)) {
                throw ERROR_ALREADY_EXISTS_FUZZER;
            }

            const data = await prismaExec(prisma => prisma.fuzz.update({
                where: { UserFuzzerID: { name: oldNameFuzzer, userEmail: email } },
                data: {
                    User: { connect: { email } },
                    updatedAt: new Date(Date.now()),
                    name: newNameFuzzer
                },
                include: { injections: true }
            }));

            return {
                ...data,
                injections: parseInjections(data.injections)
            };

        }),
    fuzzer: privateProcedure
        .input(FuzzerNameValidator)
        .mutation(async ({ ctx: { email }, input: name }) => {

            if (!(await alreadyExistsFuzzer(email, name))) {
                throw ERORR_NOT_EXISTS_FUZZER;
            }
            const data = await prismaExec(prisma => prisma.fuzz.findFirst({
                where: { AND: { name, User: { email } } },
                include: { injections: true }
            }));

            return data ? { ...data, injections: parseInjections(data.injections) } : null;

        }),
    updateReq: privateProcedure
        .input(z.object({ nameFuzzer: FuzzerNameValidator, rawRequest: RawRequestValidator, Injs: InjectionPlaceholdersValidator }))
        .mutation(async ({ ctx: { email }, input: { nameFuzzer, rawRequest, Injs } }) => {

            if (!(await alreadyExistsFuzzer(email, nameFuzzer))) {
                throw ERORR_NOT_EXISTS_FUZZER;
            }

            const data = await prismaExec(prisma => prisma.fuzz.update({
                where: { UserFuzzerID: { name: nameFuzzer, userEmail: email } },
                data: {
                    User: { connect: { email } },
                    updatedAt: new Date(Date.now()),
                    rawRequest,
                    injections: {
                        deleteMany: {
                            placeholder: { in: Injs }
                        }
                    }
                },
                include: { injections: true }
            }));

            return {
                ...data,
                injections: parseInjections(data.injections)
            };

        }),
    remove: privateProcedure
        .input(FuzzerNamesValidator)
        .mutation(async ({ ctx: { email }, input: fuzzers }) => {

            let valid = true;
            for (let i = 0; i < fuzzers.length && valid; i++) {
                const fuzz = fuzzers[i];
                if (!await alreadyExistsFuzzer(email, fuzz)) {
                    valid = false;
                }
            }

            if (!valid) {
                throw ERORR_NOT_EXISTS_FUZZERS;
            }

            const data = await prismaExec(prisma => prisma.fuzz.deleteMany({
                where: { AND: { User: { email }, name: { in: fuzzers } } }
            }));

            return data;
        }),
    fuzzers: privateProcedure
        .input(z.object({
            pagination: Pagination,
            search: z.string({ required_error: required_error("search") }).default("").optional(),
        }))
        .mutation(async ({ ctx: { email }, input: { pagination: { items, page }, search } }) => {

            const data = await prismaExec(prisma => prisma.fuzz.findMany({
                where: { AND: { User: { email }, name: { contains: search } } },
                include: { injections: true },
                take: items,
                skip: page * items,
            }));


            return data.map(({ injections, ...props }) => ({ ...props, injections: parseInjections(injections) }));
        }),


    create: privateProcedure
        .input(FuzzerValidator.omit({ injections: true }))
        .mutation(async ({ ctx: { email }, input: { name, rawRequest } }) => {

            if (await alreadyExistsFuzzer(email, name)) {
                throw ERROR_ALREADY_EXISTS_FUZZER;
            }

            const data = await prismaExec(prisma =>
                prisma.fuzz.create({
                    data: {
                        User: { connect: { email } },
                        name,
                        rawRequest
                    }
                })
            );

            return data;


        }),
    script: scriptRouter,
    injection: injectionRouter,
});


// export type definition of API
export type FuzzerRouter = typeof fuzzerRouter;

