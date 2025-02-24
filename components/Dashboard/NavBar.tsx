"use client"

import { BsLayoutSidebar } from "react-icons/bs";
import { LuArrowLeft, LuBell, LuCreditCard, LuPlus } from "react-icons/lu";
import { AppContext } from "@/contexts/AppContext";
import { useContext, useState } from "react";
import { Tooltip, TooltipTrigger, TooltipProvider, TooltipContent } from "@/components/ui/tooltip";
import Link from "next/link";
import LoadingAnimation from "../common/LoadingAnimation";
import { useUser } from "@clerk/nextjs";

interface AppContextType {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
    navbarTitle: string;
    isSidebarUsed: boolean;
    setRepositoriesUpdated: (repositoriesUpdated: boolean) => void;
}


const NavBar = () => {

    const { user } = useUser();

    const [notifications, setNotifications] = useState(true);
    const [backHomeLoading, setBackHomeLoading] = useState(false);
    const { collapsed, setCollapsed, navbarTitle, isSidebarUsed, setRepositoriesUpdated } = useContext(AppContext) as AppContextType;

    return (
        <div>
            <div className={`flex justify-between items-center px-6 py-4 h-16 border-b border-[#3D444D]`}>
                <div className="flex items-center gap-4">
                {isSidebarUsed 
                ? <BsLayoutSidebar className="cursor-pointer" onClick={() => setCollapsed(!collapsed)} /> 
                : <Link href="/" onClick={() => setBackHomeLoading(true)} className="text-[#8b929d] flex items-center gap-2">
                    
                    {backHomeLoading ? <LoadingAnimation /> : <LuArrowLeft size={18} />}
                    
                    <p className="text-xs">Back Home</p>
                </Link>}

                <h1 className="font-bold text border-l border-[#3D444D] pl-4 py-2">{navbarTitle}</h1>
                </div>


                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 cursor-pointer px-3 py-2 hover:bg-gray-800">
                        <a href="https://docs.google.com/forms/d/e/1FAIpQLSfhb7jq5653iPXupiCsMp7FuhO2OmkeSNTpQq-fZa9ULMwgDw/viewform?usp=dialog" target="_blank" rel="noopener noreferrer" className="text-xs">Feedback</a>
                    </div>
                    <div className="border-l flex items-center gap-2 border-[#3D444D] pl-4">
                        <TooltipProvider delayDuration={0}>
                            {user && (
                                <Tooltip>
                                    <TooltipTrigger>
                                        <a 
                                        href={`https://github.com/apps/gitdocs-ai/installations/new`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => setRepositoriesUpdated(true)}
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
                            )}

                            <Tooltip>
                                <TooltipTrigger>
                                    <div className="flex items-center gap-2 border border-[#3D444D] rounded-md px-2 py-1.5 hover:bg-gray-800">
                                        <LuCreditCard size={18} />
                                        <p className="text-xs">Tokens</p>
                                    </div>

                                </TooltipTrigger>

                            <TooltipContent className="bg-gray-800 text-white">
                                <p className="text-xs">Remaining Tokens</p>
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