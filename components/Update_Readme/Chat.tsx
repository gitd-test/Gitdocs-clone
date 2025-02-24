import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import { LuCheck, LuCopy } from "react-icons/lu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type ChatProps = {
    role: string;
    content: string;
    isPreview: boolean;
}

const Chat = ({role, content, isPreview}: ChatProps) => {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Reset the copied state when the content changes
        setCopied(false);
    }, [content]);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);

        const timeout = setTimeout(() => {
            setCopied(false);
        }, 2000);

        return () => clearTimeout(timeout);
    };

    return (
        <div className={`flex items-start mb-2 ${role === "user" ? "flex-row-reverse" : "flex-row"} ${isPreview ? "gap-2" : "gap-5"}`}>
            {role === "user" ? (
                <UserButton />
            ) : (
                <Image src="/gitdoc_ai.png" alt="logo" width={40} height={40} />
            )}
            <div className={`${role === "user" ? "bg-[#1b1b1b]" : "bg-[#131315]"} py-2 px-4 min-w-[12%] rounded-lg ${isPreview ? "max-w-[85%]" : "max-w-[60%]"}`}>
                <div className="flex items-start justify-between">
                    <h1 className="me-2">{role === "user" ? "You" : "Gitdocs AI"}</h1>
                    <TooltipProvider delayDuration={0}>
                        <Tooltip>
                            <TooltipTrigger>
                                {copied ? (
                                    <LuCheck className="text-[#56a85a]" size={14} />
                                ) : (
                                    <LuCopy className="text-gray-500 hover:text-white cursor-pointer" size={14} onClick={handleCopy} />
                                )}
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-800 text-white">
                                {copied ? (
                                    <p className="text-xs">Copied to clipboard</p>
                                ) : (
                                    <p className="text-xs">Copy to clipboard</p>
                                )}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                {content === "" 
                ?
                <div className="flex items-center gap-2">
                    <Skeleton className="w-4 h-4 rounded-full bg-[#848c8e]"></Skeleton>
                    <p className="text-gray-500">Gitdocs AI is thinking...</p> 
                </div>
                : 
                <p className="text-gray-300 whitespace-pre-wrap">{content.replace(/\\n/g, "\n")}</p>}

            </div>
        </div>
    );
};

export default Chat;
