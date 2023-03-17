import { Cookie } from "@/model/fuzz"
import Har, { EntriesEntity, QueryString, Request as RequestHar, Response } from "@/model/har"
import Cookies from "cookies"
import { IZapRequest } from ".."
import z from 'zod';

export interface IMessageHarArgs extends IZapRequest {
    baseurl?: string
    start?: number
    count?: number
    regex?: string,
    ids?: number
}

export enum SearchHarEnum {
    byUrl = "url",
    byId = "id-regex",
    byHeaderRegex = "header-regex",
    byRequestRegex = "req-regex",
    byUrlRegex = "url-regex",
    byResponseRegex = "resp-regex"
}

export enum MessageHarEnum {
    HAR_BY_BASE_URL = "OTHER/exim/other/exportHar",
    HAR_BY_ID = "OTHER/exim/other/exportHarById",
    HAR_BY_HEADER_REGEX = "/OTHER/search/other/harByHeaderRegex/",
    HAR_BY_RESPONSE_REGEX = "/OTHER/search/other/harByResponseRegex/",
    HAR_BY_REQUEST_REGEX = "/OTHER/search/other/harByRequestRegex/",
    HAR_BY_URL_REGEX = "/OTHER/search/other/harByUrlRegex/"
}

/** build request */
export const buildRequest = (urlString: string, pathname: MessageHarEnum, args: IMessageHarArgs) => {

    const url = new URL(urlString);

    //set pathname
    url.pathname = pathname;

    //destructoring
    const { searchParams: sP } = url;
    const { apiKey, baseurl, count, regex, start } = args;

    //set
    sP.set("apikey", apiKey);

    if (pathname === MessageHarEnum.HAR_BY_ID) {

        if (!args.ids) {
            throw new Error("id missed");
        }

        sP.set("ids", `${args.ids}`);

    } else {

        //optional
        sP.set("baseurl", `${baseurl ?? ""}`);
        sP.set("count", `${count ?? ""}`);
        sP.set("start", `${start ?? ""}`);

        if (pathname !== MessageHarEnum.HAR_BY_BASE_URL) {
            sP.set("regex", `${regex ?? ".*"}`);
        }
    }

    return url;

}

export type ContentType = "application/x-www-form-urlencoded" | "application/json" | string;

export interface Param {
    name: string,
    value: string
}

type ParamsToType = (type: ContentType, params: Param[]) => string;

const paramsToType: ParamsToType = (type, params) => {

    if (type.includes("application/x-www-form-urlencoded")) {
        return params.map(({ name, value }) => `${name}=${value}`).join("&");
    } else {
        return "";
    }
}


export const harRequestToRaw = (req: RequestHar) => {

    const { method, url, headers, httpVersion, postData } = req;
    const rawRequest =
        `${method} ${url.toString()} ${httpVersion}\r\n` +
        `${headers.map(({ name, value }) => `${name}: ${value}`).join("\r\n")}\r\n\r\n` +
        `${postData.text.length > 0 ? postData.text : paramsToType(postData.mimeType, postData.params)}`;

    return rawRequest;

}



const parseRawCookie = (cookie: string) => {
    return cookie.split(';')
        .map(v => v.split('='))
        .reduce((acc: { [key: string]: string }, v) => {
            if (v[0] && v[1]) {
                acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
            }
            return acc;
        }, {});
};

const parseCookie = (cookieRaw: string, domain: string) => {

    const rawCookies = parseRawCookie(cookieRaw);

    if (!rawCookies) {
        return [];
    }

    const cookies: Cookie[] = Object
        .keys(rawCookies)
        .filter(e => rawCookies[e])
        .map(e => ({ domain, path: "/", name: e, value: rawCookies[e] }));

    return cookies;


}


export const rawRequestToHar = (req: string) => {


    const [headers, body] = req.split(/\n{2,}/);


    const headersSize = headers.length;
    const bodySize = body ? body?.length : 0;

    let listHeaders = headers.split(/\r*\n/);

    const [method, url, httpVersion] = listHeaders[0].split(/\s/);

    //del first line GET / HTTP/1.1
    listHeaders = listHeaders.filter((e, i) => i !== 0);

    //check post both headers and body
    let isPost = method.toLowerCase().includes("post") && bodySize > 0;

    // splitted headers
    const headersHAR = listHeaders.map((item) => {

        const [name, ...values] = item.split(":");
        return { name, value: values.join(":") };
    });

    //queryString
    let queryString: QueryString[] = [];
    try {
        const { searchParams } = new URL(url);
        const keys = searchParams.keys();
        queryString = Object
            .keys(keys)
            .filter(e => searchParams.get(e) !== null) //check value null
            .map(e => ({ name: e, value: searchParams.get(e) as string })) ?? [];

    } catch (error) {
        //empty
    }

    //cookies
    let cookies: Cookie[] = [];

    try {
        const { host } = new URL(url);
        const cookieHeaderValue = headersHAR.find(e => e.name.match(/cookie/i))?.value;


        if (cookieHeaderValue && host) {
            cookies = parseCookie(cookieHeaderValue, host);
        }

    } catch (error) {
        //empty
        console.error(error);
    }


    const har: RequestHar = {
        headersSize,
        method,
        url,
        httpVersion,
        bodySize,
        postData: {
            mimeType: "",
            text: body ? body : "",
            params: []
        },
        headers: headersHAR.filter(e => e.name.length > 0 && e.value.length > 0),
        cookies,
        queryString
    }
    return har;
}

/// for tables
const extractURL = (urlString: string) => {

    const { host, pathname } = new URL(urlString);
    return [host, pathname]
}

export const extractItemForTable = ({ _zapMessageId: id, request, time, startedDateTime, response }: EntriesEntity) => {

    const { url, method, queryString, postData, cookies } = request;
    const { status, httpVersion, statusText } = response as Response;
    const [target, pathname] = extractURL(url);


    const sent = new Date(startedDateTime as string).toLocaleString();

    let params: string[][] = [];

    switch (method) {
        case "GET":
            params = queryString ? queryString.map(({ name, value }) => [name, typeof value]) : [];
            break;
        case "POST":
            params = postData.params ? postData.params.map(({ name, value }) => [name, typeof value]) : [];
            if (params.length === 0) {
                if (postData.mimeType.includes("application/json")) {
                    try {
                        const tmp = JSON.parse(postData.text);
                        params = tmp ? Object.keys(tmp).map((e: keyof typeof tmp) => [`${e.toString()}`, typeof tmp[e]]) : [];
                    } catch (e) {
                       // console.log(e);
                    }
                }
            }
            break;
        default:
            break;
    };


    return {
        url,
        statusText,
        id,
        target,
        method,
        pathname,
        time,
        sent,
        status,
        cookies,
        httpVersion,
        params
    }
}

