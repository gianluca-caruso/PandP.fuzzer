import { RequestValidator } from "@/model/fuzz";
import { Request as HarRequest } from "@/model/har";
import { IZapRequest } from "..";


export interface ISendHarRequest extends IZapRequest {
    request: HarRequest
    followRedirects: boolean
}

export interface IImportHar extends IZapRequest {
    filePath: string
}

const SEND_HAR_REQUEST_PATHNAME = "/OTHER/exim/other/sendHarRequest/";
const IMPORT_HAR_PATHNAME = "/JSON/exim/action/importHar/";

export const sendRequest = (urlEndpoint: string, payload: ISendHarRequest) => {

    const url = new URL(urlEndpoint);
    url.pathname = SEND_HAR_REQUEST_PATHNAME;

    url.searchParams.set("apikey", payload.apiKey);
    url.searchParams.set("followRedirects", payload.followRedirects ? "true" : "false");
    url.searchParams.set("request", JSON.stringify({ request: payload.request }));
    return fetch(url);
}

export const importHar = (urlEndpoint: string, payload: IImportHar) => {
    const url = new URL(urlEndpoint);
    url.pathname = IMPORT_HAR_PATHNAME;

    url.searchParams.set("apikey", payload.apiKey);
    url.searchParams.set("filePath", payload.filePath);

    return fetch(url);
}