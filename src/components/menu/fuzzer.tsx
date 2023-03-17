import Zap from '@/components/svg/zap';
import { FuzzerCtx } from "@/context/fuzzer";
import { FC, useContext } from "react";
import { AiOutlineCloudDownload, AiOutlineCloudUpload, AiOutlineDelete, AiOutlinePlus, AiOutlineSend, AiOutlineStop } from "react-icons/ai";
import { GoZap } from 'react-icons/go';
import { MdHttp, MdOutlineRequestPage } from "react-icons/md";
import { SiMozilla } from "react-icons/si";
import { TbFileImport } from 'react-icons/tb';
import { VscJson, VscListFlat } from "react-icons/vsc";
import Menu, { MenuItem, SubMenu } from ".";

export interface IFuzzerMenu {
    editable?: boolean
}

const FuzzerMenu: FC<IFuzzerMenu> = ({ editable }) => {

    const {
        openInjection,
        openDownloadHar,
        openDownloadRaw,
        openDownloadPlanYaml,
        openDownloadZest,
        openInjections,
        openHarFuzzer,
        onLoadFuzzerScript,
        onRemoveFuzzerScript,
        onRunFuzzer
    } = useContext(FuzzerCtx);

  

    return (
        <>
            {/* vertical menu */}
            <Menu>
                {/* items */}
                <MenuItem onClick={() => { openInjections() }} tooltip="injections" ><VscListFlat /></MenuItem>
                <MenuItem onClick={() => { openInjection() }} tooltip="add injection" ><AiOutlinePlus /></MenuItem>
                {/* <MenuItem onClick={() => { openInjection() }} tooltip="edit injection" className={editable ? "" : "btn-disabled"} ><FiEdit2 /></MenuItem> */}

                {/* submenu */}
                <SubMenu>
                    {/* item */}
                    <SubMenu.Item tooltip="download fuzzer">
                        <AiOutlineCloudDownload />
                    </SubMenu.Item>
                    {/* list with items */}
                    <SubMenu.List>
                        <MenuItem onClick={openDownloadPlanYaml} tooltip="yaml plan for ZAP"><p className="font-semibold text-xs">YAML</p></MenuItem>
                        <MenuItem onClick={openDownloadHar} tooltip="har in json"><VscJson /></MenuItem>
                        <MenuItem onClick={openDownloadZest} tooltip="zest script for ZAP"><SiMozilla /></MenuItem>
                        <MenuItem onClick={openDownloadRaw} tooltip="raw in txt"><MdHttp /></MenuItem>
                    </SubMenu.List>
                </SubMenu>
                <MenuItem onClick={() => openHarFuzzer(true)} tooltip="har/fuzzer" ><MdOutlineRequestPage /></MenuItem>
                <SubMenu>
                    <SubMenu.Item tooltip="ZAP panel">
                        <Zap />
                    </SubMenu.Item>
                    <SubMenu.List>
                        {/* zest */}
                        <SubMenu.Title>zest</SubMenu.Title>
                        <MenuItem onClick={onLoadFuzzerScript} tooltip="load" > <AiOutlineCloudUpload /></MenuItem>
                        <MenuItem onClick={onRemoveFuzzerScript} tooltip="remove" > <AiOutlineDelete /></MenuItem>
                        <MenuItem onClick={onRunFuzzer} tooltip="execute" ><GoZap /></MenuItem>
                    </SubMenu.List>
                </SubMenu>
            </Menu>
        </>
    )
}

export default FuzzerMenu;