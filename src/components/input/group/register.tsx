import { FC, forwardRef, ForwardRefRenderFunction, InputHTMLAttributes } from "react";
import { IInputGroup } from ".";


const Input: ForwardRefRenderFunction<HTMLInputElement, IInputGroup & { isValid?: boolean | null }> =
    ({ isValid = true, title, ...attributes }, ref) => {

        return (
            <div className="form-control">
                <label className="label">
                    <span className="label-text">{title}</span>
                </label>
                <input ref={ref} {...attributes} className={`input input-bordered ${isValid ? "" : "border-red-900"}`} />
            </div>
        );
    }

export default forwardRef(Input);