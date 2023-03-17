import { Fuzzer, Injection } from "@/model/fuzz";
import Har from "@/model/har";
import { rawRequestToHar } from ".";


//type
type GenerateHarRaw = (request: string, injections: Injection[], idx: number, requestsGenerated: string[]) => void;

//implement
export const generateHarRaw: GenerateHarRaw = (request, injections, idx, requestsGenerated) => {

    if (idx < injections.length) {
        const injection = injections[idx]; // get injection

        injection.payload.forEach(payload => { // iterate the payload that contains all string taken from regex,string and file.

            let newRequest: string = ""; // init req
        
            if (injection.occurrences.includes(0)) { // replace all occurences 
                newRequest = request.replace(injection.placeholder, payload);
            } else { // replace only a few occurences (those selected)
                let i: number = 1;
                newRequest = request.replaceAll(injection.placeholder, () => {

                    let resp: string = injection.placeholder;
                    if (injection.occurrences.includes(i)) { // check occurence index is included in injection 
                        resp = `${payload}`;
                    }
                    i++;
                    return resp;
                });
            }

            generateHarRaw(newRequest, injections, idx + 1, requestsGenerated);
        })
    }
    requestsGenerated.push(request);
}

export const fuzzerToRawRequests = (fuzzer: Fuzzer) => {

    const rawRequests: string[] = [];
    generateHarRaw(fuzzer.rawRequest, fuzzer.injections, 0, rawRequests);

    return rawRequests;
}

export const fuzzerToHar = (fuzzer: Fuzzer) => {

    
    const rawRequests: string[] = [];
    generateHarRaw(fuzzer.rawRequest, fuzzer.injections, 0, rawRequests);

    const har: Har = {
        log: {
            version:"1.2",
            entries: []
        }
    };

    for (let req of rawRequests) {
        har.log?.entries.push({ request: rawRequestToHar(req) })
    }

    return har;

}
