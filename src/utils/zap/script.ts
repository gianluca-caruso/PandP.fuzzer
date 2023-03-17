import { setupUrl } from "."


export interface IScriptLoad {
    scriptType: "standalone",
    scriptName: string,
    scriptEngine: "Mozilla Zest",
    fileName: string,
    fileDescription?: string
    charset: "utf-8"
}

export enum ScriptEnum {
    load = "/JSON/script/action/load/",
    run = "/JSON/script/action/runStandAloneScript",
    remove = "/JSON/script/action/remove/"
}


export const runScript = (endpointURL: string, apiKey: string, scriptName: string) => {
    const url = setupUrl(endpointURL, apiKey, ScriptEnum.run);
    url.searchParams.set("scriptName", scriptName);

    return fetch(url);
}

export const removeScript = (endpointURL: string, apiKey: string, scriptName: string) => {
    const url = setupUrl(endpointURL, apiKey, ScriptEnum.remove);
    url.searchParams.set("scriptName", scriptName);

    return fetch(url)
}

export const loadScript = (endpointURL: string, apiKey: string, script: IScriptLoad) => {

    const url = setupUrl(endpointURL, apiKey, ScriptEnum.load);
    url.searchParams.set("scriptType", script.scriptType);
    url.searchParams.set("scriptName", script.scriptName);
    url.searchParams.set("scriptEngine", script.scriptEngine);
    url.searchParams.set("fileName", script.fileName);
    url.searchParams.set("fileDescription", script.fileDescription ?? "");
    url.searchParams.set("charset", script.charset);


    return fetch(url);

}
