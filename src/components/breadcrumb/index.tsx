import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";
import { AiFillHome } from "react-icons/ai";


const Breadcrumb: FC = () => {

    const { asPath } = useRouter();
    const stack = asPath !== "/" ? asPath.split("/") : [];


    return (
        <>
            {stack.length > 0 ?
                <div className="text-sm breadcrumbs mb-2">
                    <ul className="lowercase">
                        {stack.map((val, idx) => {
                            if (idx === 0) {
                                return <li key={idx} ><Link href={"/"}><AiFillHome /></Link></li>;
                            } else if (idx === stack.length - 1) {
                                return <li key={idx} className="font-semibold">{val}</li>;
                            } else {
                                return (<li key={idx}>
                                    <Link href={`/${val}`}>{val}</Link>
                                </li>);
                            }
                        })}
                    </ul>
                </div> : <></>
            }
        </>
    );
}

export default Breadcrumb;