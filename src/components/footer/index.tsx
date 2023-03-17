import { FC } from "react";


export interface IFooter {

}


const Footer: FC<IFooter> = ({ }) => {


    return (
        <div className="flex flex-col justify-center ">
            <footer className="static h-screen bottom-0 footer footer-center p-4 bg-base-300 text-base-content rounded-lg">
                <div>
                    <p>Copyright © 2023 - All right reserved by ACME Industries Ltd</p>
                </div>
            </footer>
        </div>
    );
}

export default Footer;