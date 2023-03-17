import { Fuzzer as IFuzzer } from "@/model/fuzz";
import { Request as IHarRequest } from "@/model/har";
import { fuzzerToHar } from "../har/generate";
import yaml from 'yaml';

const harReqToYaml = (req: IHarRequest) => ({
    url: req.url,
    method: req.method,
    headers: req.headers.map(e => `${e.name}:${e.value}`),
    data: req.postData.text
});


export const fuzzerToPlanYaml = (fuzz: IFuzzer) => {

    const har = fuzzerToHar(fuzz);

    if (!har.log?.entries) {
        throw new Error("the har is empty");
    }

    const plan = {

        env: {
            contexts: [
                {
                    name: "default",
                    url: har.log.entries[0].request.url
                }
            ]
        },
        jobs: [
            {
                type: "requestor",
                requests: har.log.entries.map(e => harReqToYaml(e.request))
            }
        ]
    };

    return yaml.stringify(plan);

}