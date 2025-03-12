"use client";

import { LuBrain, LuChevronDown } from "react-icons/lu";
import { HiArrowPath } from "react-icons/hi2";
import { useState, useRef, useEffect, useContext } from "react";
import Chat from "./Chat";
import { fetchAIResponse } from "@/lib/fetchStreamedAiResponse";
import { useUser } from "@clerk/nextjs";
import { AppContext, AppContextType } from "@/contexts/AppContext";
import { CircleArrowUp, ChevronRight, Info } from "lucide-react";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import ProjectMetadataForm from "./ProjectMetadataForm";
import axios from "axios";

interface ChatSectionProps {
  doc_name: string;
  isPreview: boolean;
  setIsPreview: (isPreview: boolean) => void;
  content: string;
  setContent: (content: string | ((prev: string) => string)) => void;
}

const ChatSection = ({ doc_name, isPreview, content, setContent, setIsPreview }: ChatSectionProps) => {
    const { user } = useUser();
    const { setShowModel, selectedModel, showModel } = useContext(AppContext) as AppContextType;
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const chatContainerRef = useRef<HTMLDivElement | null>(null);
    const [message, setMessage] = useState<{ role: string; content: string }[]>([]);
    const [isAiGenerating, setIsAiGenerating] = useState(false);
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
    const [showProjectMetadataForm, setShowProjectMetadataForm] = useState(false);
    const [projectMetadata, setProjectMetadata] = useState({
        type: "",
        technologies: "",
        features: "",
        license: "",
        additionalInfo: "",
    });

    useEffect(() => {
        const fetchMetadata = async () => {
        try {
            const response = await axios.patch("/api/fetch/repositorydata", 
            { doc_name },
            {
                headers: {
                Authorization: `Bearer ${user?.id}`,
                },
            }
            );
            if (response.data.type !== null) {
                setProjectMetadata((prev) => ({
                ...prev,
                ...response.data
                }));
            }
        } catch (error) {
            console.error("Error fetching metadata:", error);
        }
        };
        fetchMetadata();
    }, [doc_name, user?.id]);
    
    
    const handleReset = () => {
        setMessage([]);
        setContent("");
    };

    const handleSend = async () => {
        const inputValue = textareaRef.current?.value.trim();
    
        if (!inputValue || isAiGenerating) return;
    
        // Clear the textarea and reset its height
        textareaRef.current!.value = "";
        handleInput();
    
        // Add the user's message and prepare an empty assistant response in the state
        setMessage((prev) => [
        ...prev,
        { role: "user", content: inputValue },
        { role: "assistant", content: "" },
        ]);

        // Get the last two messages, assuming messages alternate (user then assistant)
        const previousContext = (() => {
        if (message.length >= 2) {
            const lastPair = message.slice(-2);
            if (lastPair[0].role === "user" && lastPair[1].role === "assistant") {
            return `The previous messages are:\nUser: ${lastPair[0].content}\n To modify the Readme: ${content.trim()}`;
            }
        }
        return "";
        })();
    
        try {
        setIsAiGenerating(true);
        const promptWithContext = `
            The project is ${doc_name}.
            The user's message is: ${inputValue}.
            ${previousContext}
            The project metadata is: ${JSON.stringify(projectMetadata)}.
        `;

        // Fetch the streamed response
        setContent("");
        await fetchAIResponse(
            user?.id || "",
            promptWithContext,
            doc_name,
            selectedModel.value,
            (msg) => {
                // Append to the last message block instead of creating a new one
                setMessage((prev) => {
                const lastMessage = prev[prev.length - 1];
    
                if (lastMessage && lastMessage.role === msg.role) {
                    // Update content of the last message
                    const updatedMessages = [...prev];
                    updatedMessages[updatedMessages.length - 1] = {
                    ...lastMessage,
                    content: lastMessage.content + msg.content,
                    };
                    return updatedMessages;
                } else {
                    // Add a new message block if roles are different
                    return [...prev, msg];
                }
                });
            },
            (chunk) => {
            setIsPreview(true);
            setContent((prev) => prev + chunk.replace(/```markdown/g, ""));
            },
            (isPreview) => {
            console.log(isPreview);
            }
        );
        } catch (error) {
        console.error("Error fetching response:", error);
        } finally {
        setIsAiGenerating(false);
        }
    };


    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
        }
    };

    const handleInput = () => {
        if (textareaRef.current) {
        textareaRef.current.style.height = "auto"; // Reset the height
        textareaRef.current.style.height = `${Math.min(
            textareaRef.current.scrollHeight,
            3 * parseFloat(getComputedStyle(textareaRef.current).lineHeight || "20")
        )}px`;
        }
    };

    // Attach a scroll event listener to check if the user has scrolled up.
    useEffect(() => {
        const chatContainer = chatContainerRef.current;
        if (!chatContainer) return;

        const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = chatContainer;
        // Consider the user at the bottom if within 50px of the bottom
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;
        setAutoScrollEnabled(isAtBottom);
        };

        chatContainer.addEventListener("scroll", handleScroll);
        return () => chatContainer.removeEventListener("scroll", handleScroll);
    }, []);

    // Auto scroll when message updates only if autoScrollEnabled is true.
    useEffect(() => {
        if (chatContainerRef.current && autoScrollEnabled) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [message, autoScrollEnabled]);

    const handleFocus = () => {
        textareaRef.current?.focus();
    };

    return (
        <>
        {showProjectMetadataForm && <ProjectMetadataForm 
        doc_name={doc_name} 
        projectMetadata={projectMetadata} 
        setProjectMetadata={setProjectMetadata} 
        setShowProjectMetadataForm={setShowProjectMetadataForm} 
        />}
        <div
        className={`w-1/2 -mt-5 rounded-lg relative transition-all duration-300 flex-1 mx-auto ${
            isPreview ? "" : "px-40"
        }`}
        onClick={handleFocus}
        >
        <div className="group">
            <div className="z-20 rounded-full group-hover:hidden absolute top-1 left-11 text-xs">
            {projectMetadata?.type === "" && <Info size={16} className="text-[#DF737D]" />}
            </div>
            <div className={`absolute top-0 z-10 left-0 cursor-pointer flex justify-between ps-5 pe-6 py-1 items-center overflow-hidden w-14 transition-all duration-150 whitespace-nowrap rounded-full bg-[#1f1f1f] ${isPreview ? message.length === 0 ? "hover:w-[26rem]" : "hover:w-[35rem]" : message.length === 0 ? "hover:w-[29rem]" : "hover:w-[40rem]"}`}>
            <ChevronRight className="text-white me-6 flex-shrink-0" size={20} />
            <div className="text-white rounded-t-lg mx-auto flex gap-2 items-center justify-between h-12">
                <div className="flex relative items-center gap-2 text-sm border border-[#bbbbbb] cursor-pointer rounded-full p-2 ps-3 pe-2 max-w-[50%]" onClick={() => setShowProjectMetadataForm(true)}>
                <div className={`rounded-full flex-shrink-0 bg-[#8bd375] text-black font-bold flex items-center justify-center transition-all duration-150 ${isPreview ? "w-6 h-6 text-xs" : "w-7 h-7 text-sm"}`}>
                <p className="truncate w-[75%]">{doc_name.charAt(0).toUpperCase() + doc_name.charAt(1).toUpperCase()}</p>
                </div>
                <p className={`hover:underline truncate w-[55%] ${isPreview ? "text-xs max-w-[150px]" : "text-sm"}`}>{doc_name}</p>
                <LuChevronDown className={`text-white transition-all duration-150 ${showModel ? "-rotate-180" : ""}`} size={isPreview ? 16 : 20} />
                {projectMetadata?.type === "" && <TooltipProvider delayDuration={0}>
                    <Tooltip>
                    <TooltipTrigger>
                    <div className="z-20 rounded-full absolute top-0 right-0 text-xs">
                        <Info size={16} className="text-[#DF737D] bg-[#1F1F1F] rounded-full" />
                    </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" sideOffset={28}>
                        <p className="text-xs">Update project metadata for better results</p>
                    </TooltipContent>
                    </Tooltip>
                </TooltipProvider>}
                </div>

                <button className={`flex items-center gap-3 border border-[#bbbbbb] cursor-pointer rounded-full transition-all duration-150 max-w-[50%] ${isPreview ? "text-xs max-w-[175px] p-3" : "text-sm p-3"}`} onClick={() => setShowModel(true)}>
                <LuBrain className="text-white flex-shrink-0" size={isPreview ? 16 : 20} />
                <p className={`truncate w-[75%] ${isPreview ? "text-xs" : "text-sm"}`}>{selectedModel.name}</p>
                <LuChevronDown className={`text-white transition-all duration-150 ${showModel ? "-rotate-180" : ""}`} size={isPreview ? 16 : 20} />
                </button>
            </div>
            <div className="flex items-center gap-2 ms-5">
                {message.length > 0 && (
                <button
                    className={`group flex items-center gap-2 cursor-pointer border hover:bg-[#F2BD57] hover:text-black transition-all duration-150 text-[#F2BD57] border-[#F2BD57] rounded-full p-2.5 ${isPreview ? "text-xs" : "text-sm"}`}
                    onClick={handleReset}
                >
                    <HiArrowPath
                    className="focus:animate-spin transition-all duration-100"
                    size={16}
                    />
                    <span>Restart Chat</span>
                </button>
                )}
            </div>
            </div>
        </div>

        <div
            ref={chatContainerRef}
            className={`chat-container flex px-3 flex-col gap-2 pt-12 pb-16 overflow-y-scroll h-[calc(100vh-5rem)]`}
        >
            {message.map((msg, index) => (
            <Chat key={index} role={msg.role} content={msg.content} isPreview={isPreview} isAiGenerating={isAiGenerating} />
            ))}
        </div>

        <div
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 min-h-14 rounded-b-lg transition-all duration-300 w-full ${
            isPreview ? "" : " px-56"
            }`}
        >
            <div
            className={`flex items-end relative h-full border py-3 -mb-2 bg-[#141415] border-[#383737] transition-all duration-300 w-[90%] mx-auto rounded-2xl`}
            >
            <textarea
                placeholder={isAiGenerating ? "Generating..." : !(content.length > 0) ? "Share project highlights..." : "what you'd like to improve in your README..."}
                ref={textareaRef}
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                className="bg-transparent flex-1 ps-4 h-18 text-[#ece7e7] outline-none resize-none placeholder:truncate"
                rows={3}
                disabled={isAiGenerating}
            />

                <CircleArrowUp
                className="text-[#B4B4B4] hover:text-white cursor-pointer w-14"
                onClick={handleSend}
                />
            </div>
        </div>
        </div>
        </>
    );
};

export default ChatSection;
