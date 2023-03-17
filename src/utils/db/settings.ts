import { prismaExec } from "../prisma";


export const selectSettingsByUser = async (email: string) => {

    const data = await prismaExec(
        prisma => prisma.user.findFirst({
            select: { settings: true },
            where: { email }
        })
    );
    return data?.settings;
}