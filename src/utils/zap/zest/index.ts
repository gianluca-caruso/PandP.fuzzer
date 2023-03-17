import { Fuzzer, Injection } from "@/model/fuzz";
import { Cookie } from "@/model/har";
import { Statement, Zest, ZestConditional } from "@/model/zest";
import fs from "fs"
import { condense } from "strings-to-regex";
import { rawRequestToHar } from "../har";


type RawRequestToJson = (name: string, request: string, injection: Injection[]) => Zest;
type GenerateStatement =
    (statementEnd: Statement[], injections: Injection[], i?: number, state?: Statement | null, pointer?: Statement | null)
        => Statement | null;

const generateStatement: GenerateStatement = (statementEnd, injections, i = 0, state = null, pointer = null) => {


    if (i < injections.length) {

        const statement: Statement = {
            set: {
                elementType: "ZestLoopTokenStringSet",
                tokens: injections[i].payload
            },
            statements: [],
            index: i + 1,
            enabled: true,
            variableName: injections[i].placeholder,
            elementType: "ZestLoopString",
            cookies: []
        }
        i += 1;

        if (state) {
            pointer?.statements?.push(statement);
            pointer = statement;
        } else {
            state = statement;
            pointer = state;
        }

        return generateStatement(statementEnd, injections, i, state, pointer);


    } else {
        pointer?.statements?.push(...statementEnd);
        return state;

    }

}


export const rawRequestToZest: RawRequestToJson = (name, request, injections) => {

    //prepare replace placeholder on occurences with {{placeholder}}
    let req: string = request;


    injections.forEach((injection, idx) => {

        const { placeholder, occurrences } = injection;

        if (occurrences.includes(-1)) {
            req = req.replaceAll(placeholder, `{{${placeholder}}`);
        } else {
            let i: number = 1;
            req = req.replaceAll(placeholder, () => {

                let resp: string = placeholder;
                if (occurrences.includes(i)) {
                    resp = `{{${placeholder}}}`;
                }
                i++;
                return resp;
            });
        }
    });


    const [headers, body] = req.split(/\n{2,}/);
    const [method, url] = headers.split("\n")[0].split(/\s/);


    const statementEnd: Statement = {
        url: url,
        headers: headers.split(/\n/).filter((e, i) => i !== 0).join("\r\n"),
        data: body ? body : "",
        method,
        followRedirects: true,
        timestamp: 0,
        cookies: rawRequestToHar(req).cookies,
        enabled: true,
        index: injections.length + 1,
        elementType: "ZestRequest",
        set: undefined
    };

    // strings to regex for reflected in zest script

    const mergeInjections = injections.map(e => e.payload).flat().filter(e => e.length >= 1); // merge all payloads in each element of the injections into flat array
    const matcher = condense(mergeInjections); // convert - string to regex

    const statementRoot: ZestConditional = {

        rootExpression: {
            children: [
                {
                    regex: matcher.source,
                    caseExact: false,
                    variableName: "response.body",
                    not: false,
                    elementType: "ZestExpressionRegex"
                },
                {
                    regex: matcher.source,
                    caseExact: false,
                    variableName: "response.header",
                    not: false,
                    elementType: "ZestExpressionRegex"
                }
            ],
            not: false,
            elementType: "ZestExpressionOr"
        },
        ifStatements: [],
        elseStatements: [
            {
                message: "",
                priority: "HIGH",
                index: injections.length + 3,
                enabled: true,
                elementType: "ZestActionFail"
            }
        ],
        index: injections.length + 2,
        enabled: true,
        elementType: "ZestConditional"
    }

    const statement = generateStatement([statementEnd, statementRoot], injections); //generation


    const zest: Zest = {
        about: "this is a Zest script. For more details about Zest visit https://github.com/zaproxy/zest/",
        zestVersion: "0.8",
        title: name,
        description: "",
        elementType: "ZestScript",
        enabled: true,
        prefix: "",
        authentication: [],
        type: "StandAlone",
        index: 0,
        parameters: {
            elementType: "ZestVariables",
            tokenEnd: "}}",
            tokens: {},
            tokenStart: "{{"
        },
        statements: statement ? [statement] : []

    }
    return zest;
}

export const fuzzerToZest = (fuzzer: Fuzzer) => {
    return rawRequestToZest(fuzzer.name, fuzzer.rawRequest, fuzzer.injections);
}