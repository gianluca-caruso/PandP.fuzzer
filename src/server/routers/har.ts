import Har, { HarSearchValidator } from "@/model/har";
import { Pagination } from "@/model/pagination";
import { selectSettingsByUser } from "@/utils/db/settings";
import { HAR, isZapError, IZapError } from '@/utils/zap';
import { SearchHarEnum } from "@/utils/zap/har";
import { TRPCError } from "@trpc/server";
import z from 'zod';
import { privateProcedure, router } from "@/server/trpc";



export const harRouter = router({

    /* todo: coming soon
      sendRequest: privateProcedure
          .input(RequestValidator)
          .mutation(async ({ ctx: { email }, input: request }) => {
  
              const { URLEndpoint, apiKey } = await selectSettingsByUser(email) as Settings;
              const data = await sendRequest(URLEndpoint, { apiKey, followRedirects: true, request });
              return data.ok;
          }), */
    search: privateProcedure
        .input(HarSearchValidator)
        .mutation(async ({ ctx: { email }, input }) => {

            const settings = await selectSettingsByUser(email);

            if (!settings) {
                throw new TRPCError({ code: "BAD_REQUEST" });
            }

            const { URLEndpoint, apiKey } = settings;
            const { pagination: { items, page }, search, by, baseurl, ids } = input;

            const options: HAR.IMessageHarArgs = {
                apiKey,
                baseurl,
                ids,
                regex: search,
                start: page * items,
                count: items
            };

            let url: URL;

            switch (by) {
                case SearchHarEnum.byUrl:
                    url = HAR.buildRequest(URLEndpoint, HAR.MessageHarEnum.HAR_BY_BASE_URL, options);
                    break;
                case SearchHarEnum.byId:
                    url = HAR.buildRequest(URLEndpoint, HAR.MessageHarEnum.HAR_BY_ID, options);
                    break;
                case SearchHarEnum.byHeaderRegex:
                    url = HAR.buildRequest(URLEndpoint, HAR.MessageHarEnum.HAR_BY_HEADER_REGEX, options);
                    break;
                case SearchHarEnum.byResponseRegex:
                    url = HAR.buildRequest(URLEndpoint, HAR.MessageHarEnum.HAR_BY_RESPONSE_REGEX, options);
                    break;
                case SearchHarEnum.byRequestRegex:
                    url = HAR.buildRequest(URLEndpoint, HAR.MessageHarEnum.HAR_BY_REQUEST_REGEX, options);
                    break;
                case SearchHarEnum.byUrlRegex:
                    url = HAR.buildRequest(URLEndpoint, HAR.MessageHarEnum.HAR_BY_URL_REGEX, options);
                    break;
            }


            const response = await fetch(url);
            const json = await response.json();

            return isZapError(json) ? json as IZapError : json as Har;

        })


});


// export type definition of API
export type HarRouter = typeof harRouter;
