import { HTMLAttributes } from "react";
import { InputHTMLAttributes } from "react";
import { FC } from "react";
import { FaSearch } from "react-icons/fa";





export const SearchButton: FC<HTMLAttributes<HTMLButtonElement>> = ({ className, ...attributes }) => {

    return (
        <button className={`btn btn-md btn-ghost rounded-2xl bg-base-100 max-w-xs ${className}`} {...attributes}>
            <FaSearch className="self-center w-7" />
        </button>
    )
};


export const SearchInput: FC<InputHTMLAttributes<HTMLInputElement>> = ({ className, ...attributes }) => {

    return (
        <input
            {...attributes}
            type="search"
            className={`basis-2/3 input pl-2 input-ghost border-none focus:outline-none w-full max-w-xs ${className}`} />
    )
};

export interface SubComponentSearchBar {
    Button: typeof SearchButton,
    Input: typeof SearchInput,
}

const SearchBar: FC<HTMLAttributes<HTMLDivElement>> & SubComponentSearchBar = ({ className, children, ...attributes }) => {

    return (
        <div className={`shadow-lg flex flex-row focus-within:bg-base-100 bg-base-200 p-[5px] rounded-2xl ${className}`} {...attributes}>
            {children}
        </div>
    )
}

SearchBar.Button = SearchButton;
SearchBar.Input = SearchInput;


export default SearchBar;