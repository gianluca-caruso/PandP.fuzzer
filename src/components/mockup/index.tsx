import { IReactComponentChildren } from "@/context";
import { ChangeEventHandler, FC, HTMLAttributes } from "react";
import Tooltip from "../tooltip";

export interface IMockup {
    title: string
}

const Button: FC<HTMLAttributes<HTMLButtonElement>> = ({ className, children, ...attributes }) => {

    return (
        <button className={`btn rounded-2xl btn-ghost tooltip tooltip-left ${className}`} {...attributes}>
            {children}
        </button>
    );
};


export const Actions: FC<HTMLAttributes<HTMLDivElement>> & { Button: typeof Button } = ({ className, children, ...attributes }) => {

    return (
        <div className={`flex flex-row p-2 absolute bottom-0 right-0 left-0 ${className}`} {...attributes}>
            {children}
        </div>
    );
}

Actions.Button = Button;


const Mockup: FC<IMockup & IReactComponentChildren> & { Actions: typeof Actions } = ({ title, children }) => {

    return (
        <div className="mockup-code w-full min-h-full">
            <pre data-prefix="$"><code>{title}</code></pre>
            {children}
        </div>
    );
}

Mockup.Actions = Actions;

export default Mockup;