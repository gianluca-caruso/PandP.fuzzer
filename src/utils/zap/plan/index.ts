import { IZapRequest } from "..";

export interface IPlanProgress extends IZapRequest {
    planId: number
}

export interface ISendPlan extends IZapRequest {
    filePath: string
}

const PLAN_PROGRESS_PATHANME = "/JSON/automation/view/planProgress/";
const PLAN_RUN_PATHNAME = "/JSON/automation/action/runPlan/";


export const sendPlan = (endpoint: string, state: ISendPlan) => {

    const url = new URL(endpoint);
    url.pathname = PLAN_RUN_PATHNAME;

    url.searchParams.set("apikey", state.apiKey);
    url.searchParams.set("filePath", state.filePath);

    return fetch(url);
}

export const getProgressPlan = (endpoint: string, state: IPlanProgress) => {

    const url = new URL(endpoint);
    url.pathname = PLAN_PROGRESS_PATHANME;

    url.searchParams.set("apikey", state.apiKey);
    url.searchParams.set("planId", state.planId.toString());

    return fetch(url);
}


