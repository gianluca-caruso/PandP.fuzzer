import { invalid_type, invalid_type_number, invalid_type_positive_number, invalid_type_string, invalid_type_url, required_error } from "@/utils/error"
import { SearchHarEnum } from "@/utils/zap/har"

// todo: refactoring
export default interface Har {
    log?: Log
}
export interface Log {
    version?: string
    creator?: Creator
    entries: EntriesEntity[]
}


export interface Creator {
    name: string
    version: string
}
export interface EntriesEntity {
    startedDateTime?: string
    time?: number
    request: Request
    response?: Response
    cache?: Cache
    timings?: Timings
    _zapMessageId?: number
    _zapMessageNote?: string
    _zapMessageType?: string
}
export interface Request {
    method: string
    url: string
    httpVersion: string
    cookies: HeadersCookie[]
    headers: HeadersEntity[]
    queryString: QueryString[]
    postData: PostData
    headersSize: number
    bodySize: number
}

export interface Cookie {
    domain?: string | null
    name?: string | null
    value?: string | null
    path?: string | null
    secure?: boolean | null
}

export interface HeadersCookie extends Cookie {
    expires?: string | null
    httpOnly?: boolean | null
}

export interface HeadersEntity {
    name: string
    value: string
}
export interface QueryString {
    name: string
    value: string
}
export interface PostData {
    mimeType: string
    params: Params[]
    text: string
}
export interface Params {
    name: string,
    value: string
}
export interface Response {
    status: number
    statusText: string
    httpVersion: string
    cookies?: (CookiesEntity | null)[] | null
    headers?: (HeadersEntityOrCookiesEntityOrQueryStringEntity3 | null)[] | null
    content: Content
    redirectURL: string
    headersSize: number
    bodySize: number
}
export interface CookiesEntity {
    name: string
    value: string
    domain: string
    expires: string
    httpOnly: boolean
    secure: boolean
}
export interface HeadersEntityOrCookiesEntityOrQueryStringEntity3 {
    name: string
    value: string
}
export interface Content {
    size: number
    compression: number
    mimeType: string
    text?: string | null
    encoding?: string | null
}
export interface Cache { }

export interface Timings {
    send: number
    wait: number
    receive: number
}

import z from 'zod';
import { Pagination } from "./pagination"


export const HarSearchValidator = z.object({
    search: z.string({ invalid_type_error: invalid_type_string("search") }).optional(),
    pagination: Pagination,
    baseurl: z.string({ invalid_type_error: invalid_type_string("baseurl") }).url({ message: invalid_type_url("baseurl") }).optional(),
    ids: z.number({ invalid_type_error: invalid_type_number("ids") }).nonnegative({ message: invalid_type_positive_number("ids") }).optional(),
    by: z.nativeEnum(SearchHarEnum).default(SearchHarEnum.byUrl)
});

export type HarSearch = z.infer<typeof HarSearchValidator>;