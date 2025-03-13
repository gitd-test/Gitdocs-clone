"use client";

import { LuPlus, LuBrain, LuChevronDown, LuFile } from "react-icons/lu";
import { HiArrowPath } from "react-icons/hi2";
import { FaSyncAlt, FaFileAlt, FaBriefcase } from "react-icons/fa";
import { useState, useRef, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import Chat from "./Chat";
import { fetchAIResponse } from "@/lib/fetchStreamedAiResponse";
import { useUser } from "@clerk/nextjs";
import { AppContext, AppContextType } from "@/contexts/AppContext";
import { CircleArrowUp, ChevronRight, Info } from "lucide-react";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "../ui/tooltip";
import ProjectMetadataForm from "./ProjectMetadataForm";
import axios from "axios";
import ShinyButton from "../common/ShinyButton";
import LoadingAnimation from "../common/LoadingAnimation";

interface ChatSectionProps {
  doc_name: string;
  isPreview: boolean;
  setIsPreview: (isPreview: boolean) => void;
  content: string;
  setContent: (content: string | ((prev: string) => string)) => void;
}

const ChatSection = ({
  doc_name,
  isPreview,
  content,
  setContent,
  setIsPreview,
}: ChatSectionProps) => {
  const { user } = useUser();
  const router = useRouter();
  const { setShowModel, selectedModel, showModel, storedUser, setStoredUser } = useContext(AppContext) as AppContextType;
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
  const [backupContent, setBackupContent] = useState("");
  const [usageOverviewtrigger, setUsageOverviewtrigger] = useState(0);

  useEffect(() => {
    const fetchUsageOverview = async () => {
      const response = await axios.get("/api/fetch/usageoverviewdata", {
        headers: {
          Authorization: `Bearer ${user?.id}`,
        },
      });
      const newUsageOverview = response.data;
      
      // Only update if new tokensUsed is greater
      if (newUsageOverview.data.tokensUsed > (storedUser?.usageOverview.tokensUsed || 0)) {
        setStoredUser((prev) => {
          if (!prev) return null; // or handle the missing user appropriately
          
          return {
            ...prev,
            usageOverview: newUsageOverview.data,
            // Ensure required fields are always set (fallback to previous value or a default)
            subscriptionType: prev.subscriptionType || "",
            stepsCompleted: prev.stepsCompleted !== undefined ? prev.stepsCompleted : 0,
          };
        });
      }
    };
    
    fetchUsageOverview();
  }, [usageOverviewtrigger, user?.id, storedUser, setStoredUser]);
  
  

  useEffect(() => {
    const fetchMetadata = async () => {
      if (doc_name === "#Chat-with-GitDocs-AI-Assistant#") return;
      try {
        const response = await axios.patch(
          "/api/fetch/repositorydata",
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
            ...response.data,
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
          return `The previous messages are:\nUser: ${
            lastPair[0].content
          }\n To modify the Readme: ${content.trim() ? content.trim() : backupContent.trim()}`;
        }
      }
      return "";
    })();

    try {
      setIsAiGenerating(true);
      let promptWithContext = `
            The project is ${doc_name}.
            The user's message is: ${inputValue}.
            ${previousContext}
            The project metadata is: ${JSON.stringify(projectMetadata)}.
        `;

      if (doc_name === "#Chat-with-GitDocs-AI-Assistant#") {
        promptWithContext = `
          This is a general chat with the user.
          The user's message is: ${inputValue}.
          ${previousContext}999
        `;
      }

      // Fetch the streamed response
      setBackupContent(content);
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
          setContent((prev) => prev + chunk);
        },
        (isPreview) => {
          console.log(isPreview);
        }
      );
    } catch (error) {
      console.error("Error fetching response:", error);
    } finally {
      setIsAiGenerating(false);
      setUsageOverviewtrigger((prev) => prev + 1);
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
        5 * parseFloat(getComputedStyle(textareaRef.current).lineHeight || "40")
      )}px`;
    }
  };

  const defaultOptions = [
    {
      icon: <LuFile />,
      label: "Generate Example Readme",
      value: "example",
      disabled: doc_name !== "#Chat-with-GitDocs-AI-Assistant#",
    },
    {
      icon: <LuFile />,
      label: "Generate Contribution Guidelines",
      value: "contribution",
      disabled: doc_name !== "#Chat-with-GitDocs-AI-Assistant#",
    },
    {
      icon: <LuFile />,
      label: "Improve Code Examples",
      value: "code",
      disabled: doc_name !== "#Chat-with-GitDocs-AI-Assistant#",
    },
    {
      icon: <FaSyncAlt />,
      label: "Improve my Readme",
      value: "improve",
      disabled: doc_name === "#Chat-with-GitDocs-AI-Assistant#",
    },
    {
      icon: <FaFileAlt />,
      label: "Make a new Readme",
      value: "generate",
      disabled: doc_name === "#Chat-with-GitDocs-AI-Assistant#",
    },
    {
      icon: <FaBriefcase />,
      label: "Professional Readme",
      value: "professional",
      disabled: doc_name === "#Chat-with-GitDocs-AI-Assistant#",
    },
  ];

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
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [message, autoScrollEnabled]);

  const handleFocus = () => {
    textareaRef.current?.focus();
  };

  return (
    <>
      {showProjectMetadataForm && (
        <ProjectMetadataForm
          doc_name={doc_name}
          projectMetadata={projectMetadata}
          setProjectMetadata={setProjectMetadata}
          setShowProjectMetadataForm={setShowProjectMetadataForm}
        />
      )}
      <div
        className={`w-1/2 -mt-5 rounded-lg relative transition-all duration-300 flex-1 mx-auto ${
          isPreview ? "" : "px-40"
        }`}
        onClick={handleFocus}
      >
        <div className="group">
          <div className="z-20 rounded-full group-hover:hidden absolute top-1 left-11 text-xs">
            {projectMetadata?.type === "" && (
              <Info
                size={16}
                className={`${
                  doc_name === "#Chat-with-GitDocs-AI-Assistant#"
                    ? "text-[#F2BD57]"
                    : "text-[#DF737D]"
                }`}
              />
            )}
          </div>
          <div
            className={`absolute top-0 z-10 left-0 cursor-pointer flex justify-between px-5 py-1 items-center overflow-hidden w-14 transition-all duration-150 whitespace-nowrap rounded-full bg-[#1f1f1f] ${
              isPreview
                ? message.length === 0
                  ? "hover:w-[26rem]"
                  : "hover:w-[32rem]"
                : message.length === 0
                ? "hover:w-[29rem]"
                : "hover:w-[36rem]"
            }`}
          >
            <ChevronRight className="text-white me-6 flex-shrink-0" size={20} />
            <div className="text-white rounded-t-lg mx-auto flex gap-2 items-center justify-between h-12">
              <div
                className={`flex relative items-center gap-2 text-sm border border-[#bbbbbb] cursor-pointer rounded-full ${
                  isPreview ? "max-w-[9rem]" : "max-w-[11rem]"
                } ${
                  doc_name === "#Chat-with-GitDocs-AI-Assistant#"
                    ? "py-2.5 ps-3 pe-2"
                    : "py-2 ps-3 pe-2"
                }`}
                onClick={() => {
                  if (doc_name === "#Chat-with-GitDocs-AI-Assistant#")
                    return router.push("/dashboard?tab=projects");
                  setShowProjectMetadataForm(true);
                }}
              >
                {doc_name !== "#Chat-with-GitDocs-AI-Assistant#" ? (
                  <div
                    className={`rounded-full flex-shrink-0 bg-[#8bd375] text-black font-bold flex items-center justify-center transition-all duration-150 ${
                      isPreview ? "w-6 h-6 text-xs" : "w-7 h-7 text-sm"
                    }`}
                  >
                    <p className="truncate w-[75%]">
                      {doc_name.charAt(0).toUpperCase() +
                        doc_name.charAt(1).toUpperCase()}
                    </p>
                  </div>
                ) : (
                  <LuPlus size={isPreview ? 20 : 23} className="text-white" />
                )}
                <p
                  className={`hover:underline truncate w-[55%] ${
                    isPreview ? "text-xs max-w-[150px]" : "text-sm"
                  }`}
                >
                  {doc_name === "#Chat-with-GitDocs-AI-Assistant#"
                    ? "Choose a project"
                    : doc_name}
                </p>
                <LuChevronDown
                  className={`text-white transition-all duration-150 ${
                    showModel ? "-rotate-180" : ""
                  }`}
                  size={isPreview ? 16 : 20}
                />
                {(projectMetadata?.type === "" ||
                  doc_name === "#Chat-with-GitDocs-AI-Assistant#") && (
                  <TooltipProvider delayDuration={0}>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="z-20 rounded-full absolute top-0 right-0 text-xs">
                          <Info
                            size={16}
                            className={`${
                              doc_name === "#Chat-with-GitDocs-AI-Assistant#"
                                ? "text-[#F2BD57]"
                                : "text-[#DF737D]"
                            } bg-[#1F1F1F] rounded-full`}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" sideOffset={28}>
                        <p className="text-xs">
                          {doc_name === "#Chat-with-GitDocs-AI-Assistant#"
                            ? "Choose a project to create a Readme"
                            : "Update project metadata for better results"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>

              <button
                className={`flex items-center gap-3 border border-[#bbbbbb] p-3 cursor-pointer rounded-full transition-all duration-150 ${
                  isPreview ? "text-xs max-w-[9rem]" : "text-sm max-w-[11rem]"
                }`}
                onClick={() => setShowModel(true)}
              >
                <LuBrain
                  className="text-white flex-shrink-0"
                  size={isPreview ? 16 : 20}
                />
                <p
                  className={`truncate w-[75%] ${
                    isPreview ? "text-xs" : "text-sm"
                  }`}
                >
                  {selectedModel.name}
                </p>
                <LuChevronDown
                  className={`text-white transition-all duration-150 ${
                    showModel ? "-rotate-180" : ""
                  }`}
                  size={isPreview ? 16 : 20}
                />
              </button>
            </div>
            <div className="flex items-center gap-2 ms-0.5">
              {message.length > 0 &&
                doc_name !== "#Chat-with-GitDocs-AI-Assistant#" && (
                  <button
                    className={`group flex items-center gap-2 cursor-pointer border hover:bg-[#F2BD57] hover:text-black transition-all duration-150 text-[#F2BD57] border-[#F2BD57] rounded-full p-3 ${
                      isPreview ? "text-xs" : "text-sm"
                    }`}
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

        {message.length > 0 && (
          <div
            ref={chatContainerRef}
            className={`chat-container flex px-3 flex-col gap-2 pt-12 pb-16 overflow-y-scroll h-[calc(100vh-5rem)]`}
          >
            {message.map((msg, index) => (
              <Chat
                key={index}
                role={msg.role}
                content={msg.content}
                isPreview={isPreview}
                isAiGenerating={isAiGenerating}
              />
            ))}
          </div>
        )}

        <div
          className={`absolute left-1/2 -translate-x-1/2 min-h-14 rounded-b-lg transition-all duration-300 w-full ${
            isPreview ? "" : " px-56"
          } ${message.length === 0 ? "top-1/2 -translate-y-1/2" : "bottom-0"}`}
        >
          <div
            className={`flex items-end relative h-full border py-3 border-[#383737] transition-all duration-300 w-[90%] mx-auto rounded-2xl ${
              message.length === 0 ? "bg-transparent" : "-mb-2 bg-[#141415]"
            }`}
          >
            {message.length === 0 && (
              <>
                <div className="absolute -z-10 bottom-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black opacity-50 rounded-2xl"></div>
                <h1 className="absolute -top-16 left-1/2 -translate-x-1/2 text-center text-4xl bg-gradient-to-b from-white to-[#a7a4a4] text-transparent bg-clip-text w-full font-bold">
                  What can i help you with ?
                </h1>
                {
                  <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-full justify-center text-center text-white flex gap-3">
                    {defaultOptions.map((option, index) => (
                      <>
                        {!option.disabled && (
                          <ShinyButton
                            key={index}
                            label={option.label}
                            icon={option.icon}
                            isPreview={isPreview}
                            onClick={() => {}}
                          />
                        )}
                      </>
                    ))}
                  </div>
                }
              </>
            )}
            <textarea
              placeholder={
                isAiGenerating
                  ? "Generating..."
                  : !(content.length > 0)
                  ? "Share project highlights..."
                  : "what you'd like to improve in your README..."
              }
              ref={textareaRef}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              className="bg-transparent flex-1 ps-4 h-18 text-[#ece7e7] outline-none resize-none placeholder:truncate"
              rows={3}
              disabled={isAiGenerating}
            />

            {!isAiGenerating ? (
              <CircleArrowUp
                className="text-[#B4B4B4] hover:text-white cursor-pointer w-14"
                onClick={handleSend}
              />
            ) : (
              <div className="me-5 mb-1 scale-150">
                <LoadingAnimation />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatSection;
