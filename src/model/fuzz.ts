import { invalid_min_length, invalid_type_date, invalid_type_date_array, invalid_type_int, invalid_type_number, invalid_type_positive_number, invalid_type_string, invalid_type_string_array, required_error } from "@/utils/error";
import { z } from "zod";
import { Request as RequestHar } from './har';

// todo: refactoring
//____
export const RegexValidator = z.object({
    regex: z.string(),
    size: z.number()
});

export const FileValidator = z.object({
    text: z.string().min(1),
    name: z.string().optional(),
    lastModified: z.bigint().optional(),
    lastModifiedData: z.date().optional(),
    size: z.number().optional(),
    type: z.string().regex(/\w+\/\w+/).optional(),
    webkitRelativePath: z.string().optional()
})


export const CookieValidator = z.object({
    domain: z.string().optional().nullable(),
    name: z.string().optional().nullable(),
    value: z.string().optional().nullable(),
    path: z.string().optional().nullable(),
    secure: z.boolean().optional().nullable(),
    httpOnly: z.boolean().optional().nullable()
});


export const ParamValidator = z.object({
    name: z.string(),
    value: z.string()
});

export const PostDataValidator = z.object({
    mimeType: z.string(),
    params: z.array(ParamValidator),
    text: z.string()
});

export const RequestValidator = z.object({
    method: z.string().min(1),
    url: z.string().url(),
    httpVersion: z.string().min(1),
    cookies: z.array(CookieValidator),
    headers: z.array(ParamValidator),
    queryString: z.array(ParamValidator),
    postData: PostDataValidator,
    headersSize: z.number().nonnegative(),
    bodySize: z.number().nonnegative()
});
//____

//injection
// refactoring injectionValidator

export const PlaceholderValidator = z.string({ required_error: required_error("placeholder"), invalid_type_error: invalid_type_string("placeholder") }).min(1, { message: invalid_min_length(1, "placeholder") });

export const InjectionValidator = z.object({
    id: z.number({ invalid_type_error: invalid_type_number("id") }).optional().nullable(),
    placeholder: PlaceholderValidator,
    occurrences: z.array(z.number({ required_error: invalid_type_number("occurence") }).int({ message: invalid_type_int("occurence") }).min(-1)),
    payload: z.array(z.string({ required_error: "payload is required", invalid_type_error: invalid_type_string("payload") })),
    file: z.string({ invalid_type_error: invalid_type_string("file") }).optional().nullable(),
    text: z.string({ invalid_type_error: invalid_type_string("text") }).optional().nullable(),
    sizeRegex: z.number({ invalid_type_error: invalid_type_number("sizeRegex") }).nonnegative({ message: invalid_type_positive_number("sizeRegex") }).optional().nullable(),
    outputRegex: z.string({ invalid_type_error: invalid_type_string("outputRegex") }).optional().nullable(),
    regex: z.string({ invalid_type_error: invalid_type_string("regex") }).optional().nullable()
});

export const InjectionPlaceholdersValidator = z.array(PlaceholderValidator);

//generate z.rawcreateparams from the validator
export const nameParams: z.RawCreateParams = {
    description: "Name",
    required_error: required_error("Name"),
    invalid_type_error: invalid_type_string("Name"),
};

export const rawRequestParams: z.RawCreateParams = {
    description: "Raw Request",
    required_error: required_error("Raw Request"),
    invalid_type_error: invalid_type_string("Raw Request"),
};

//generate z.rawcreateparams from the FuzzerValidator
export const fuzzerParams: z.RawCreateParams = {
    description: "Fuzzer",
    required_error: required_error("Fuzzer"),
};

export const FuzzerNameValidator = z.string(nameParams);
export const FuzzerNamesValidator = z.array(FuzzerNameValidator, { required_error: required_error("fuzzers name"), invalid_type_error: invalid_type_string_array("fuzzers name") });
export const RawRequestValidator = z.string(rawRequestParams);

export const FuzzerValidator = z.object({
    name: FuzzerNameValidator,
    id: z.number().nonnegative().optional(),
    rawRequest: RawRequestValidator,
    injections: z.array(InjectionValidator),
    createdAt: z.string({ invalid_type_error: invalid_type_date("createdAt") }).datetime({ message: invalid_type_date("createdAt") }).optional(),
    updatedAt: z.string({ invalid_type_error: invalid_type_date("updatedAt") }).datetime({ message: invalid_type_date("updatedAt") }).optional()
}, fuzzerParams);

export type Regex = z.infer<typeof RegexValidator>;
export type File = z.infer<typeof FileValidator>;
export type FuzzerRequest = z.infer<typeof RequestValidator>;
export type Injection = z.infer<typeof InjectionValidator>;
export type Cookie = z.infer<typeof CookieValidator>;
export type Fuzzer = z.infer<typeof FuzzerValidator>;




