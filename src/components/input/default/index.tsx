import { IReactComponentChildren } from "@/context";
import { forwardRef, ForwardRefRenderFunction } from "react";
import Indicator, { Badge } from "../../indicator";
import { IInputGroup } from "../group";


export interface SubcomponentsInputIndicator {
    Badge: typeof Badge
}

export const Input: ForwardRefRenderFunction<HTMLInputElement, IInputGroup> & SubcomponentsInputIndicator = ({ title, children, className, ...attributes }, ref) =>
    <>
        <label className="label">
            <span className="label-text">{title}</span>
        </label>
        <Indicator>
            {children}
            <input ref={ref} {...attributes} className={`input input-bordered ${className}`} />
        </Indicator>
    </>

Input.Badge = Badge;

const InputF = forwardRef(Input);
export default InputF;

