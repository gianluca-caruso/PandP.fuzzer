import { Cookie } from "./har"


export interface Zest {
    about: "this is a Zest script. For more details about Zest visit https://github.com/zaproxy/zest/" | string
    zestVersion: "0.8" | string
    title: string
    description: string
    prefix: string
    type: "StandAlone" | string
    parameters: Parameters
    authentication: []
    statements: Statement[]
    index: number
    enabled: boolean
    elementType: "ZestScript"
}

export interface Parameters {
    tokenStart: "{{"
    tokenEnd: "}}"
    tokens: {}
    elementType: "ZestVariables"
}

export type ElementType = "ZestRequest" | "ZestLoopString" | "ZestConditional" |
    "ZestActionFail" | "ZestActionPrint" | "ZestExpressionRegex" | "ZestExpressionOr" | string;

type Method = "GET" | "POST" | "PUT" | "OPTION" | "DELETE" | "UPDATE" | string;

export interface Statement {
    set?: Set
    statements?: Statement[]
    variableName?: string
    index?: number
    enabled?: boolean
    elementType: ElementType
    url?: string
    data?: string
    cookies?: Cookie[]
    method?: Method
    headers?: string
    followRedirects?: boolean
    timestamp?: number
}

export interface Set {
    tokens: string[]
    elementType: "ZestLoopTokenStringSet"
}


export interface ElseStatment extends Statement {
    message: ""
    priority: "HIGH" | "LOW" | "MEDIUM"
    enabled: true
    elementType: "ZestActionFail"
}

export interface IfStatement extends Statement {
    message: "**match [{{i}}, {{j}}]**"
    enabled: true,
    elementType: "ZestActionPrint"
}

export interface ZestConditional {
    rootExpression: RootExpression
    ifStatements: (Statement | IfStatement)[]
    elseStatements: (Statement | ElseStatment)[]
    index: number
    enabled: boolean
    elementType: string
}


export interface RootExpression {
    children: ChildRootExpression[]
    not: boolean
    elementType: | string
}

export interface ChildRootExpression {
    regex: string
    variableName: "response.header" | "response.body" | string
    caseExact: boolean
    not: boolean
    elementType: ElementType
}