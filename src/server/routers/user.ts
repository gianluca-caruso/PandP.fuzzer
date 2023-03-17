import { EmailValidator, NameValidator, PasswordValidator, UserValidator } from "@/model/user";
import { hashPassword, register } from "@/utils/auth/credentials";
import { validatePassword } from "@/server/utils/password";
import { prismaExec } from "@/utils/prisma";
import { z } from "zod";
import { privateProcedure, publicProcedure, router } from "../trpc";


export const userRouter = router({
    create: publicProcedure
        .input(UserValidator)
        .mutation(async ({ input }) => {
            const usr = await register(input);
            return usr;
        }),

    select: privateProcedure
        .query(async ({ ctx: { email } }) => {
            const data = await prismaExec(prisma => prisma.user.findFirst({ where: { email }, select: { name: true, email: true } }));
            return data;
        }),
    update: privateProcedure
        .input(z.object({
            user: UserValidator.extend({
                email: EmailValidator.optional(),
                password: PasswordValidator.optional(),
                name: NameValidator.optional()
            }), password: PasswordValidator
        }))
        .mutation(async ({ ctx: { email }, input: { user, password } }) => {

            await validatePassword(email, password);

            let hash: string | undefined = undefined;
            if (user.password) {
                hash = await hashPassword(user.password);
            }

            const data = await prismaExec(prisma => prisma.user.update({
                where: { email },
                data: {
                    email: user.email,
                    password: hash,
                    name: user.name,
                },
                select: { name: true, email: true }
            }));

            return data;

        }),
    delete: privateProcedure
        .input(PasswordValidator)
        .mutation(async ({ ctx: { email }, input: password }) => {
            await validatePassword(email, password);
            const data = await prismaExec(prisma => prisma.user.delete({ where: { email } }));
            return data;
        })

});


// export type definition of API
export type userRouter = typeof userRouter;