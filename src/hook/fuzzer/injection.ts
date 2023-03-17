import { FileCtx } from "@/context/fuzzer/injection/file";
import { PlaceholderCtx } from "@/context/fuzzer/injection/placeholder";
import { RegexCtx } from "@/context/fuzzer/injection/regex";
import { TextCtx } from "@/context/fuzzer/injection/text";
import { Injection } from "@/model/fuzz";
import { useContext, useCallback } from "react";



export const useInjection = () => {

    const { placeholder, set: setPlaceholder, isValid: isValidPlaceholder, clear: clearPlaceholder, setOccurence, setOccurences } =
        useContext(PlaceholderCtx);
    const { clearOutput: clearOutputRegex, generate: generateRegex, output: outputRegex, regex, set: setRegex, clear: clearRegex }
        = useContext(RegexCtx);
    const { text, set: setText, clear: clearText } = useContext(TextCtx);
    const { file, set: setFile, clear: clearFile } = useContext(FileCtx);


    const set = (injection: Injection) => {
        const { placeholder, file, regex, sizeRegex, text, outputRegex, occurrences } = injection;
        setPlaceholder(placeholder);
        file && setFile(file);
        regex && setRegex({ regex: regex, size: sizeRegex ?? 0 });
        outputRegex && generateRegex(outputRegex);
        setText(text ?? "");
        setOccurences(occurrences);

    }

    const clear = useCallback(() => {
        clearPlaceholder();
        clearFile();
        clearRegex();
        clearText();
    }, [clearFile, clearPlaceholder, clearRegex, clearText]);

    return {
        set,
        //placeholder
        placeholder,
        setOccurencePlaceholder: setOccurence,
        setPlaceholder,
        isValidPlaceholder,
        clearPlaceholder,
        //text
        text,
        setText,
        clearText,
        //file
        file,
        setFile,
        clearFile,
        //regex
        regex,
        setRegex,
        outputRegex,
        generateRegex,
        clearOutputRegex,
        clearRegex,
        // global clear
        clear,
    }

}


