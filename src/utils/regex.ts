import { Regex } from "@/model/fuzz";
import { expandAll, expandN } from "regex-to-strings";


export const generateRegex = (regex: Regex) => {

    if (regex.size === 0) {
        return expandAll(regex.regex).join("\n") ?? "";
    } else if (regex.size > 0) {
        return expandN(regex.regex, regex.size).join("\n") ?? "";
    }else{
        return "";
    }
}