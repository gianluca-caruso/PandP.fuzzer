import Dropdown from "@/components/dropdown";
import InputF, { Input } from "@/components/input/default";
import { PlaceholderCtx } from "@/context/fuzzer/injection/placeholder";
import { FC, InputHTMLAttributes, HTMLInputTypeAttribute, useContext, useState, useEffect } from "react";
import { BiChevronDownCircle, BiErrorCircle } from "react-icons/bi";


const Wrap: FC<InputHTMLAttributes<HTMLDivElement>> = ({ className, children, ...attributes }) => {

    return (
        <div className={`flex flex-row gap-2 justify-start ${className}`} {...attributes}>
            {children}
        </div>
    );
}

export interface IPlaceholder {
    isValid?: boolean
}

const Placeholder: FC<InputHTMLAttributes<HTMLInputElement> & IPlaceholder> = ({ isValid, className, ...attributes }) => {

    return (
        <div className="self-end form-control basis-2/3 h-1/2 justify-end">
            <InputF title={"placeholder"} className={`w-full ${className}`} {...attributes}>
                {isValid === undefined ?
                    <></> :
                    <Input.Badge>
                        {isValid ? <BiChevronDownCircle color="green" /> : <BiErrorCircle color="red" />}
                    </Input.Badge>
                }
            </InputF>
        </div>
    );
}

const DropdownItemFuzz: FC<{ title: string } & InputHTMLAttributes<HTMLInputElement>> = ({ title, className, ...attributes }) => {

    return (
        <li>
            <div>
                <input type={"checkbox"} className={`checkbox ${className}`} {...attributes} />
                <p>{title}</p>
            </div>
        </li>
    )
}

export interface IPlaceholderInjection extends IPlaceholder { }

const PlaceholderInjection: FC<IPlaceholderInjection> = () => {


    const { placeholder, set, setOccurence, isValid } = useContext(PlaceholderCtx);

    return (
        <Wrap>
            <Placeholder isValid={isValid} value={placeholder.placeholder} onChange={({ currentTarget: { value } }) => set(value)} />
            <Dropdown className="basis-1/3 h-1/2 justify-end ml-2">
                <Dropdown.Label>occurences</Dropdown.Label>
                <Dropdown.List className="max-h-[200px] ">
                    <div className="overflow-auto">
                        {placeholder.occurencesCheck.map((check, idx) => {
                            return <DropdownItemFuzz
                                key={idx}
                                title={`${placeholder.occurences[idx] === -1 ? "all" : placeholder.occurences[idx]}`}
                                checked={check}
                                onChange={(({ currentTarget: { checked } }) => setOccurence(idx, checked))}
                            />
                        })}
                    </div>
                </Dropdown.List>
            </Dropdown>
        </Wrap>
    )
}

export default PlaceholderInjection;