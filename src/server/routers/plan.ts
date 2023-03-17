/*todo: coming soon
import { FuzzerValidator } from "@/model/fuzz";
import { isZapError, parseZapResponse } from "@/utils/zap";
import { sendPlan } from "@/utils/zap/plan";
import { fuzzerToPlanYaml } from "@/utils/zap/plan/generate";
import { Settings } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import fs, { existsSync } from 'fs';
import path from "path";
import { privateProcedure, router } from "../trpc";
import { selectSettingsByUser } from "./settings";


export const planRouter = router({
    run: privateProcedure
        .input(FuzzerValidator.omit({ createdAt: true, updatedAt: true }))
        .mutation(async ({ ctx: { email }, input: fuzzer }) => {

            const plan = fuzzerToPlanYaml(fuzzer);
            const filename = path.join(DIR_PLAN, fuzzer.name + ".yaml");

            if (!existsSync(DIR_PLAN)) {
                fs.mkdirSync(DIR_PLAN);
            }

            const { URLEndpoint, apiKey } = await selectSettingsByUser(email) as Settings;

            const createFile = new Promise<void>((resolve, reject) =>
                fs.writeFile(filename, plan, err => err ? reject(err) : resolve())
            );
            await createFile;

            const data = await parseZapResponse(await sendPlan(URLEndpoint, { apiKey, filePath: filename }));
            return data;

        }),
});



// export type definition of API
export type PlanRouter = typeof planRouter;
 */


export {};
