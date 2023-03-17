import Tooltip from "@/components/tooltip";
import { IReactComponentChildren } from "@/context";
import { ClassAttributes, FC, forwardRef, ForwardRefRenderFunction, InputHTMLAttributes, LegacyRef } from "react";
import { input } from "zod";


export interface IInputGroup extends InputHTMLAttributes<HTMLInputElement> {
    title: string
    tip?: string
}


const InputGroup: ForwardRefRenderFunction<HTMLInputElement, IInputGroup> = ({ title, tip, className, ...attributes }, ref) => {

    if (tip) {
        return (
            <Tooltip content={tip}>
                <label className="input-group w-full">
                    <span className="basis-1/4 w-max">{title}</span>
                    <input ref={ref} {...attributes} className={`basis-3/4 input input-bordered w-full ${className}`} />
                </label>
            </Tooltip >
        );
    }
    return (
        <>
            <label className="input-group w-full">
                <span className="basis-1/4 w-max">{title}</span>
                <input ref={ref} {...attributes} className={`basis-3/4 input input-bordered w-full ${className}`} />
            </label>
        </>
    );

}


export default forwardRef(InputGroup);