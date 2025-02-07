"use client"

import { BsLayoutSidebar } from "react-icons/bs";
import { LuArrowLeft, LuBell, LuCreditCard, LuPlus } from "react-icons/lu";
import SearchBar from "../common/SearchBar";
import { AppContext } from "@/contexts/AppContext";
import { useContext, useState } from "react";
import { Tooltip, TooltipTrigger, TooltipProvider, TooltipContent } from "@/components/ui/tooltip";
import Link from "next/link";
import LoadingAnimation from "../common/LoadingAnimation";

interface AppContextType {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
    navbarTitle: string;
    isSidebarUsed: boolean;
}

const NavBar = () => {

    const [notifications, setNotifications] = useState(true);
    const [backHomeLoading, setBackHomeLoading] = useState(false);
    const { collapsed, setCollapsed, navbarTitle, isSidebarUsed } = useContext(AppContext) as AppContextType;

    return (
        <div>
            <div className={`flex justify-between items-center px-6 py-4 h-16 border-b border-[#3D444D]`}>
                <div className="flex items-center gap-4">
                {isSidebarUsed 
                ? <BsLayoutSidebar className="cursor-pointer" onClick={() => setCollapsed(!collapsed)} /> 
                : <Link href="/" className="text-[#8b929d] flex items-center gap-2">
                    
                    {backHomeLoading ? <LoadingAnimation /> : <LuArrowLeft size={18} onClick={() => setBackHomeLoading(true)} />}
                    
                    <p className="text-xs">Back Home</p>
                </Link>}

                <h1 className="font-bold text border-l border-[#3D444D] pl-4 py-2">{navbarTitle}</h1>
                </div>


                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 cursor-pointer px-3 py-2 hover:bg-gray-800">
                        <p className="text-xs">Feedback</p>
                    </div>
                    <SearchBar />
                    <div className="border-l flex items-center gap-2 border-[#3D444D] pl-4">
                        <TooltipProvider delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger>
                                    <a 
                                    href={`https://github.com/apps/gitdocs-ai/installations/new`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 border border-[#3D444D] rounded-md px-2 py-1.5 hover:bg-gray-800">
                                        <LuPlus size={18} />
                                        <p
                                        className="text-xs">New</p>
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent className="bg-gray-800 text-white">

                                    <p className="text-xs">Add New Repository</p>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="flex items-center gap-2 border border-[#3D444D] rounded-md px-2 py-1.5 hover:bg-gray-800">
                                        <LuCreditCard size={18} />
                                        <p className="text-xs">Credits</p>
                                    </div>

                                </TooltipTrigger>

                            <TooltipContent className="bg-gray-800 text-white">
                                <p className="text-xs">Remaining Credits</p>
                            </TooltipContent>
                            
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className="border-l border-[#3D444D] pl-4">
                        <TooltipProvider delayDuration={0}>
                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="relative hover:bg-gray-800 rounded-md p-2">
                                    <LuBell  size={20} />
                                    {notifications && (
                                        <div className="absolute top-2 right-2 w-2 h-2 bg-[#DF737D] rounded-full"></div>
                                    )}
                                    </div>

                                </TooltipTrigger>
                            <TooltipContent className="bg-gray-800 text-white">
                                <p className="text-xs">Notifications</p>

                            </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </div>
        </div>


    )
}

export default NavBar