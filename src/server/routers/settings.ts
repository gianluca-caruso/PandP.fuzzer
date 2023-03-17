import { privateProcedure, publicProcedure, router } from "../trpc";
import z from 'zod';
import { prismaExec } from "@/utils/prisma";
import { Theme } from "@/context/global/theme";
import { SettingsValidator, ThemeValidator } from "@/model/settings";
import { TRPCError } from "@trpc/server";
import { Prisma, Settings, User } from "@prisma/client";
import * as ZAP from "@/utils/zap";
import { selectSettingsByUser } from "@/utils/db/settings";


export const settingsRouter = router({

    checkConn: privateProcedure
        .query(async ({ ctx }) => {
            const { email } = ctx;
            const data = await selectSettingsByUser(email);
            const { apiKey, URLEndpoint } = data as Settings;

            const url = ZAP.buildRequest(URLEndpoint, ZAP.GlobalEnum.version, { apiKey });

            try {
                const resp = await fetch(url);
                return resp.status === 200;

            } catch (error) {
                const { message } = error as Error;
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message });
            }

        }),
    settings: privateProcedure
        .query(async ({ ctx }) => {
            const { email } = ctx;
            const setting = await selectSettingsByUser(email);
            return setting;
        }),
    update: privateProcedure
        .input(SettingsValidator)
        .mutation(async ({ input, ctx }) => {

            const { email } = ctx;

            return await prismaExec(prisma => prisma?.user.update({
                where: { email },
                data: { settings: { update: input } }
            }));

            //throw new TRPCError({ code: "BAD_REQUEST" });
        }),
    setTheme: privateProcedure
        .input(ThemeValidator)
        .mutation(async ({ input, ctx }) => {
            const { email } = ctx;

            // after validation
            if (input === "none") {
                throw new Error("the theme must be either dark or light or system");
            }

            const setting = await selectSettingsByUser(email);

            const select: Prisma.UserSelect = { settings: { select: { theme: true } } };

            if (setting) {
                return await prismaExec(prisma =>
                    prisma.user.update({
                        where: { email },
                        select,
                        data: { settings: { update: { theme: input } } }
                    })
                );
            } else {
                return await prismaExec(prisma =>
                    prisma.user.update({
                        where: { email },
                        select,
                        data: { settings: { create: { theme: input } } }
                    })
                );
            }

        }),
    theme: privateProcedure
        .query(async ({ ctx }) => {
            const data = await selectSettingsByUser(ctx.email);
            return data?.theme;
        })


});


// export type definition of API
export type SettingsRouter = typeof settingsRouter;