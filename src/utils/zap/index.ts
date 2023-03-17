import { Injection } from "@/model/fuzz";
import { TRPCError } from "@trpc/server";

export * as HAR from "./har";

export interface IZapRequest {
    apiKey: string
}

export enum GlobalEnum {
    version = "/JSON/core/view/version/"
}

export const buildRequest = (urlString: string, pathname: GlobalEnum, args: IZapRequest) => {

    const url = new URL(urlString);
    //set pathname
    url.pathname = pathname;

    // set params
    url.searchParams.set("apikey", args.apiKey);

    return url;

}


export const setupUrl = (endpointURL: string, apiKey: string, pathname: string) => {
    const url = new URL(endpointURL);
    url.pathname = pathname;
    url.searchParams.set("apikey", apiKey);

    return url;
}

export interface IZapError {
    code: string,
    message: string
}

export const isZapError = (json: Object): json is IZapError => {
    return "code" in json && "message" in json;
}

export const validateChangeRequest = (rawRequest: string, injections: Injection[]) => {

    const injectionInValid: string[] = [];

    for (const injection of injections) {

        let valid: boolean = true;

        const { placeholder, occurrences } = injection;

        if (occurrences.length === 0) {
            valid = false;
        } else {
            const maxOccurences = [...occurrences].sort((a, b) => b - a)[0];
            const occurencesLen = rawRequest.split(placeholder).length - 1;

            if (!rawRequest.includes(placeholder) || maxOccurences > occurencesLen) {
                valid = false;
            }
        }

        if (!valid) {
            injectionInValid.push(injection.placeholder);
        }
    }

    return injectionInValid;
}

/** check response ZAP and return the json */
export const parseZapResponse = async (resp: Response) => {

    if (!resp.ok) {
        throw new Error(resp.statusText);
    }
    const json = await resp.json();

    if (isZapError(json)) {
        throw new Error(json.message);
    }

    return json;
}


