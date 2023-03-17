import { checkPassword } from "@/utils/auth/credentials";
import { prismaExec } from "@/utils/prisma";
import { TRPCError } from "@trpc/server";


export const validatePassword = async (email: string, password: string) => {

    const select = await prismaExec(prisma => prisma.user.findFirst({ where: { email } }));

    if (!select || !select.password) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
    return await checkPassword(password, select.password);

}