"use client"

import { LuArrowLeft, LuBell, LuCreditCard, LuPlus } from "react-icons/lu";
import { AppContext } from "@/contexts/AppContext";
import { useContext, useState } from "react";
import { Tooltip, TooltipTrigger, TooltipProvider, TooltipContent } from "@/components/ui/tooltip";
import Link from "next/link";
import LoadingAnimation from "../common/LoadingAnimation";
import { useUser } from "@clerk/nextjs";

interface AppContextType {
    navbarTitle: string;
    isSidebarUsed: boolean;
    setRepositoriesUpdated: (repositoriesUpdated: boolean) => void;
}


const NavBar = () => {

    const { user } = useUser();

    const [notifications, setNotifications] = useState(true);
    const [backHomeLoading, setBackHomeLoading] = useState(false);
    const { navbarTitle, isSidebarUsed, setRepositoriesUpdated } = useContext(AppContext) as AppContextType;

    return (
        <>
            <div className={`flex justify-between items-center px-6 py-4 h-16 border-b border-[#3D444D]`}>
                <div className="flex items-center gap-4">
                {isSidebarUsed 
                ? <p className="text-xs">Home</p>
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
            {(user && isSidebarUsed) && <div className="sticky top-0 flex items-center justify-center text-[0.9rem] gap-4 px-6 py-4 h-11 bg-[#483C16] text-[#FFC106] tracking-wide">
                Please add credits to your team in order to make API requests.
            </div>}
        </>
    )
}

export default NavBar