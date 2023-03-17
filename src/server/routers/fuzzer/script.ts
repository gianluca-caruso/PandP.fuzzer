import z from 'zod';
import { privateProcedure, router } from "@/server/trpc";
import { selectSettingsByUser } from '@/utils/db/settings';
import { Settings } from '@prisma/client';
import { loadScript, removeScript, runScript } from '@/utils/zap/script';
import path from 'path';
import { TRPCError } from '@trpc/server';
import { FuzzerValidator } from '@/model/fuzz';
import { extractPayload } from '@/reducer/features/fuzzer/fuzzer.slice';
import { isZapError, parseZapResponse } from '@/utils/zap';
import { rawRequestToZest } from '@/utils/zap/zest';
import { existsSync } from 'fs';
import fs from 'fs';


const DIR_SCRIPT_ZEST = path.join(process.cwd(), process.env.DIR_SCRIPT_ZEST);

export const scriptRouter = router({
    remove: privateProcedure
        .input(z.string().min(1))
        .mutation(async ({ ctx: { email }, input }) => {

            const { URLEndpoint, apiKey } = await selectSettingsByUser(email) as Settings;

            const resp = await removeScript(
                URLEndpoint,
                apiKey,
                input
            );

            const data = await resp.json();

            if (isZapError(data)) {
                const { code, message } = data;
                throw new TRPCError({ code: "PARSE_ERROR", message, cause: code });
            }

            return data;

        }),
    run: privateProcedure
        .input(z.string().min(1))
        .mutation(async ({ ctx: { email }, input }) => {

            const { URLEndpoint, apiKey } = await selectSettingsByUser(email) as Settings;

            const resp = await runScript(
                URLEndpoint,
                apiKey,
                input
            );

            return await parseZapResponse(resp);

        }),
    load: privateProcedure
        .input(FuzzerValidator)
        .mutation(async ({ ctx: { email }, input }) => {
            const { injections, name, rawRequest } = input;

            const injectionsWithPayload = injections.map(e => ({
                ...e,
                payload: extractPayload(e)
            }));

            const data = rawRequestToZest(
                name,
                rawRequest,
                injectionsWithPayload
            );

            if (!existsSync(DIR_SCRIPT_ZEST)) {
                fs.mkdirSync(DIR_SCRIPT_ZEST);
            }

            const fileName = path.join(DIR_SCRIPT_ZEST, `${name}.zst`);

            const promise = new Promise<void>((resolve, reject) =>
                fs.writeFile(fileName, JSON.stringify(data, null, 2), err => err ? reject(err) : resolve())
            );

            await promise;

            const { URLEndpoint, apiKey } = await selectSettingsByUser(email) as Settings;

            const resp = await loadScript(
                URLEndpoint,
                apiKey,
                {
                    charset: "utf-8",
                    fileName,
                    scriptType: "standalone",
                    scriptName: name,
                    scriptEngine: "Mozilla Zest"
                }
            );

            return await parseZapResponse(resp);

        })

});

// export type definition of API
export type ScriptRouter = typeof scriptRouter;
