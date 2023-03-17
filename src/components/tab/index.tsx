import { FC, HTMLAttributes, InputHTMLAttributes } from "react";


//root component
export interface TabSubComponent {
    Item: typeof TabItem
}

const Tab: FC<InputHTMLAttributes<HTMLInputElement>> & TabSubComponent = ({ children, className, ...attributes }) => {


    return (
        <div className={`tabs tabs-boxed justify-center ${className}`} {...attributes}>
            {children}
        </div>
    );
};



// subcomponent
export interface ITabItem {
    active?: boolean
}

const TabItem: FC<ITabItem & HTMLAttributes<HTMLAnchorElement>> = ({ active = false, className, children, ...attributes }) => {

    return (
        <a {...attributes} className={`tab ${active ? "tab-active" : ""} ${className}`}>{children}</a>
    )
}

// add subcomponent inside root component
Tab.Item = TabItem;



export default Tab;
