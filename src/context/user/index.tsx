import { FC } from "react";
import { IReactComponentChildren } from "..";
import ProfileProvider from "./profile";
import SettingsProvider from "./settings";

const UserProvider:FC<IReactComponentChildren> = ({children}) => {
    
    return (
        <ProfileProvider>
            <SettingsProvider>
                {children}
            </SettingsProvider>
        </ProfileProvider>
    )

};

export default UserProvider;