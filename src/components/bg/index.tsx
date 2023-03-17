import { FC } from "react";
import MirrorLogo from "../svg/mirror.logo";



const Bg:FC = () => (
    <div className="flex flex-row justify-center fixed bottom-0 right-0 left-0 opacity-5">
        <MirrorLogo
            className="p-2 fill-base-content stroke-base-content w-1/2"
        />
        <MirrorLogo
            className="p-2 fill-base-content stroke-base-content w-1/2 scale-x-[-1]"
        />
    </div>
);


export default Bg;