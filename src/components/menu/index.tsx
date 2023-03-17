import { IReactComponentChildren } from "@/context";
import { FC, HTMLAttributes, ReactNode } from "react"
import Tooltip from "../tooltip";

export interface IMenu {
    children: ReactNode | ReactNode[]
}


export interface IMenuItem extends HTMLAttributes<HTMLAnchorElement> {
    tooltip?: string
}

export const MenuItem: FC<IMenuItem> = ({ children, tooltip, ...attributes }) => {

    return tooltip ? (<Tooltip content={tooltip}><li><a {...attributes} className={`flex flex-row justify-center ${attributes.className}`}>{children}</a></li></Tooltip>)
        : (<li><a {...attributes} className={`flex flex-row justify-center ${attributes.className}`}>{children}</a></li>);
}

export const MenuTitle: FC<HTMLAttributes<HTMLLIElement>> = ({ title, className, children, ...attributes }) => {

    return (
        <li className={`menu-title justify-center ${className}`} {...attributes}>
            <span>{children}</span>
        </li>
    );
}


export interface ISubComponentMenu {
    Item: typeof MenuItem
    Title: typeof MenuTitle
}

const Menu: FC<IMenu> & ISubComponentMenu = ({ children }) => {

    return (
        <ul className="menu bg-base-100 rounded-box p-2 shadow-lg max-lg:menu-horizontal">
            {children}
        </ul>
    );
}

Menu.Item = MenuItem;
Menu.Title = MenuTitle;

export const HMenu: FC<IMenu> & ISubComponentMenu = ({ children }) => {

    return (
        <ul className="menu bg-base-100 rounded-box p-2 shadow-lg menu-horizontal">
            {children}
        </ul>
    );
}

HMenu.Item = MenuItem;
HMenu.Title = MenuTitle;


export const ListMenu: FC<HTMLAttributes<HTMLUListElement>> = ({ children, ...attributes }) => {

    return (
        <ul {...attributes} className={`rounded-box p-2 bg-base-100 ${attributes.className}`}>
            {children}
        </ul>
    )
}

export interface IMenuItemSubMenu extends HTMLAttributes<HTMLSpanElement> {
    tooltip?: string
}


export const ItemSubMenu: FC<IMenuItemSubMenu> = ({ children, tooltip, ...attributes }) => {


    return tooltip
        ? (
            <Tooltip content={tooltip}>
                <span {...attributes} className={`flex flex-row justify-center ${attributes.className}`}>{children}</span>
            </Tooltip>
        ) :
        (
            <span {...attributes} className={`flex flex-row justify-center ${attributes.className}`}>{children}</span>
        );
}


export const SubMenu: FC<HTMLAttributes<HTMLLIElement>> & { Item: typeof ItemSubMenu, List: typeof ListMenu, Title: typeof MenuTitle } = ({ children, ...attributes }) => {

    return (
        <li tabIndex={0} {...attributes}>
            {children}
        </li>
    )
}

SubMenu.Item = ItemSubMenu;
SubMenu.List = ListMenu;
SubMenu.Title = MenuTitle;

export default Menu;