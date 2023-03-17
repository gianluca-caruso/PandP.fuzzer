import { InjectionValidator } from "@/model/fuzz";
import { Pagination } from "@/model/pagination";
import { privateProcedure, router } from "@/server/trpc";
import { alreadyExistsInjection, ERORR_NOT_EXISTS_FUZZER, ERORR_NOT_EXISTS_INJECTION, ERROR_ALREADY_EXISTS_INJECTION, parseInjection, parseInjections, selectFuzzerByUserEmailAndName } from "@/utils/db/fuzzer";
import { prismaExec } from "@/utils/prisma";
import z from 'zod';
import { Injection as InjectionModel } from '@/model/fuzz';


export const injectionRouter = router({
    injections: privateProcedure
        .input(z.object({ pagination: Pagination, name: z.string().min(1), search: z.string().optional().default("") }))
        .mutation(async ({ ctx: { email }, input: { name, pagination: { items, page }, search } }) => {

            const data = await prismaExec(prisma => prisma.injection.findMany({
                where: {
                    AND: {
                        Fuzz: { name, User: { email } },
                        placeholder: { contains: search }
                    }
                },
                take: items,
                skip: page * items,
            }));


            return parseInjections(data);

        }),

    injection: privateProcedure
        .input(z.object({ nameFuzzer: z.string().min(1), placeholder: z.string().min(1) }))
        .mutation(async ({ ctx: { email }, input: { nameFuzzer, placeholder } }) => {

            const data = await prismaExec(prisma => prisma.injection.findFirst({
                where: { AND: { placeholder, Fuzz: { AND: { name: nameFuzzer, User: { email } } } } }
            }));

            return data ? parseInjection(data) : null;
        }),
    add: privateProcedure // TODO: change name in addInjection
        .input(z.object({
            injection: InjectionValidator,
            name: z.string().min(1),
        }))
        .mutation(async ({ ctx: { email }, input: { injection, name } }) => {

            if (await alreadyExistsInjection(email, name, injection.placeholder)) {
                throw ERROR_ALREADY_EXISTS_INJECTION;
            }


            const data = await prismaExec(prisma =>
                prisma.fuzz.update({
                    where: { UserFuzzerID: { name, userEmail: email } },
                    data: {
                        User: { connect: { email } },
                        updatedAt: new Date(Date.now()),
                        injections: {
                            create: {
                                outputRegex: injection.outputRegex,
                                file: injection.file,
                                placeholder: injection.placeholder,
                                text: injection.text,
                                regex: injection.regex,
                                sizeRegex: injection.sizeRegex,
                                occurrences: JSON.stringify(injection.occurrences)
                            }
                        }
                    },
                    include: { injections: true }
                })
            );

            return { placeholder: injection.placeholder, injections: parseInjections([...data.injections]) as InjectionModel[] };

        }),
    remove: privateProcedure
        .input(z.object({
            placeholder: z.string().min(1),
            nameFuzzer: z.string().min(1)
        }))
        .mutation(async ({ ctx: { email }, input: { placeholder, nameFuzzer } }) => {

            if (!(await alreadyExistsInjection(email, nameFuzzer, placeholder))) {
                throw ERORR_NOT_EXISTS_INJECTION;
            }

            const data = await prismaExec(prisma => prisma.fuzz.update({
                where: { UserFuzzerID: { name: nameFuzzer, userEmail: email } },
                data: {
                    User: { connect: { email } },
                    updatedAt: new Date(Date.now()),
                    injections: {
                        deleteMany: { placeholder }
                    }
                }
            }));

            /* const data = await prismaExec(prisma => prisma.injection.deleteMany({
                where: { placeholder, Fuzz: { name: nameFuzzer, User: { email } } }
            })); */

            return data ? placeholder : null;


        }),
    update: privateProcedure
        .input(z.object({
            injection: InjectionValidator,
            name: z.string().min(1),
            placeholder: z.string().min(1)
        }))
        .mutation(async ({ ctx: { email }, input: { injection, name, placeholder } }) => {

            if (!(await alreadyExistsInjection(email, name, placeholder))) {
                throw ERORR_NOT_EXISTS_INJECTION;
            }

            const fuzz = await selectFuzzerByUserEmailAndName(email, name);

            if (!fuzz) {
                throw ERORR_NOT_EXISTS_FUZZER;
            }

            const data = await prismaExec(prisma => prisma.fuzz.update({
                where: { UserFuzzerID: { name: name, userEmail: email } },
                data: {
                    User: { connect: { email } },
                    updatedAt: new Date(Date.now()),
                    injections: {
                        update: {
                            where: { PlaceholderFuzzerID: { idFuzzer: fuzz.id, placeholder } },
                            data: {
                                file: injection.file,
                                outputRegex: injection.outputRegex,
                                placeholder: injection.placeholder,
                                text: injection.text,
                                regex: injection.regex,
                                sizeRegex: injection.sizeRegex,
                                occurrences: JSON.stringify(injection.occurrences)
                            }
                        }
                    }
                }, include: { injections: true }
            }));

            return data ? placeholder : null;
        }),
});


// export type definition of API
export type InjectionRouter = typeof injectionRouter;