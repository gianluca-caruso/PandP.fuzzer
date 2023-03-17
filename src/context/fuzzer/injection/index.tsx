import { IReactComponentChildren } from "@/context";
import { FC } from "react";
import ProviderFuzzerInjectionFile from "./file";
import ProviderFuzzerInjectionPlaceholder from "./placeholder";
import ProviderFuzzerInjectionRegex from "./regex";
import ProviderFuzzerInjectionText from "./text";



const ProviderFuzzerInjection: FC<IReactComponentChildren> = ({ children }) => {

    return (
        <ProviderFuzzerInjectionPlaceholder>
            <ProviderFuzzerInjectionText>
                <ProviderFuzzerInjectionFile>
                    <ProviderFuzzerInjectionRegex>
                        {children}
                    </ProviderFuzzerInjectionRegex>
                </ProviderFuzzerInjectionFile>
            </ProviderFuzzerInjectionText>
        </ProviderFuzzerInjectionPlaceholder>
    )
}

export default ProviderFuzzerInjection;