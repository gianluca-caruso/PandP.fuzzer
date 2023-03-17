import { IReactComponentChildren } from "@/context";
import { Children, FC, ForwardedRef, forwardRef, ForwardRefRenderFunction, HTMLAttributes, ReactElement, ReactNode, RefObject, useEffect, useRef } from "react";
import { JsxElement } from "typescript";

// sub componets
export const Title: FC<IReactComponentChildren> = ({ children }) => {
    return (
        <h3 className="font-bold text-lg">{children}</h3>
    );
}

export const Actions: FC<HTMLAttributes<HTMLDivElement>> = ({ className, children, ...attributes }) => {

    return (
        <div className={`modal-action ${className}`} {...attributes}>
            {children}
        </div>
    );
}

export const Body: FC<HTMLAttributes<HTMLDivElement>> = ({ className, children, ...attributes }) => {

    return (
        <div className={` flex flex-col gap-2 m-2 p-2 ${className}`} {...attributes}>
            {children}
        </div>
    )
};

export interface SubComponents {
    Title: typeof Title
    Body: typeof Body
    Actions: typeof Actions
}

// modal
export interface IModal {
    id: string
    isOpen: boolean
    set: (state: boolean) => void
}

export const Modal: FC<IModal & HTMLAttributes<HTMLDivElement>> & SubComponents = ({ id, children, isOpen, set, className, ...attributes }) => {


    return (
        <>
            <input type="checkbox" id={id} className="modal-toggle" checked={isOpen} onChange={e => set(e.currentTarget.checked)} />
            <div className="modal" id={id}>
                <div className={`modal-box w-full h-max ${className} `} {...attributes}>
                    <label htmlFor={id} className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                    {children}
                </div>
            </div>
        </>
    );
}

// setup subcomponents
Modal.Title = Title;
Modal.Body = Body;
Modal.Actions = Actions;


export default Modal;