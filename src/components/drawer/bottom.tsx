import { IReactComponentChildren } from "@/context";
import React, { FC, ReactNode, useEffect } from "react";

export interface IBottomDrawer extends IReactComponentChildren {
  isOpen?: boolean
  onTap: () => void
}

const BottomDrawer: FC<IBottomDrawer> = ({ children, isOpen = false, onTap }) => {

  return (
    <div
      className={`fixed overflow-clip z-50 inset-0 transform ease-in-out
        ${isOpen
          ? " transition-opacity opacity-100 duration-500 translate-y-0"
          : " transition-all delay-500 opacity-0 translate-y-full"}`
      }
    >
      <div
        className={`w-full bottom-0 absolute h-max shadow-xl delay-400 duration-500 ease-in-out transition-all transform 
          ${isOpen ? "translate-y-0" : "translate-y-full"}`
        }
      >
        <div className="rounded-t-lg bg-base-300 relative w-screen pb-10 flex flex-col space-y-6 overflow-y-scroll scrollbar-hide h-full p-4">
          <button className="hover:animate-pulse min-h-[10px] min-w-[200px] self-center bg-base-100 rounded-3xl" onClick={() => onTap()}></button>
          {children}
        </div>
      </div>
      <div
        className=" w-screen h-full cursor-pointer "
        onClick={() => {
          onTap();
        }}
      ></div>
    </div>
  );
}
export default BottomDrawer;