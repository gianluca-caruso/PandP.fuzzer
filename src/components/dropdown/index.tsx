import { FC, HTMLAttributes } from "react"


export interface ISubComponentsDropdown {
    Label: typeof DropdownLabel
    List: typeof DropdownList
}
const Dropdown: FC<HTMLAttributes<HTMLDivElement>> & ISubComponentsDropdown = ({ children, className, ...attributes }) => {

    return (
        <div className={`dropdown dropdown-bottom self-end form-control ${className}`} {...attributes}>
            {children}
        </div>
    )
}

const DropdownLabel: FC<HTMLAttributes<HTMLLabelElement>> = ({ children, className, ...attributes }) => {

    return (
        <label tabIndex={0} className={`select select-bordered flex-col justify-center ${className}`}  {...attributes}>
            {children}
        </label>
    )
}

const DropdownList: FC<HTMLAttributes<HTMLUListElement>> = ({ children, className, ...attributes }) => {

    return (
        <ul tabIndex={0} className={`dropdown-content menu gap-2 p-2 shadow bg-base-100 rounded-box w-full ${className}`} {...attributes}>
            {children}
        </ul>
    )
}

Dropdown.Label = DropdownLabel;
Dropdown.List = DropdownList;

export default Dropdown;