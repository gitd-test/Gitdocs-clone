"use client";

import { LuPaperclip, LuSend, LuBrain, LuChevronDown } from "react-icons/lu";
import { HiArrowPath } from "react-icons/hi2";
import { useState, useRef, useEffect, useContext } from "react";
import Chat from "./Chat";
import { fetchStreamedResponse } from "@/lib/fetchStreamedAiResponse";
import { useUser } from "@clerk/nextjs";
import { AppContext } from "@/contexts/AppContext";

interface ChatSectionProps {
  doc_name: string;
  isPreview: boolean;
  setIsPreview: (isPreview: boolean) => void;
  content: string;
  setContent: (content: string | ((prev: string) => string)) => void;
}

interface Model {
  name: string;
  value: string;
}

type AppContextType = {
  showModel: boolean;
  setShowModel: (showModel: boolean) => void;
  selectedModel: Model;
}

const ChatSection = ({ doc_name, isPreview, content, setContent, setIsPreview }: ChatSectionProps) => {
  const { user } = useUser();

  const { setShowModel, selectedModel, showModel } = useContext(AppContext) as AppContextType;
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [message, setMessage] = useState<{ role: string; content: string }[]>([]);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  let previewContent = false;
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
  
    try {
      setIsAiGenerating(true);
      const promptWithContext = `
        The project is ${doc_name}.
        The user's message is: ${inputValue}.
        The previous messages are: ${message
          .map((msg) => `${msg.role}: ${msg.content}`)
          .join("\n")}.
        The previous readme file is: ${content}.
      `;

      // Fetch the streamed response
      setContent("");
      await fetchStreamedResponse(user?.id || "", promptWithContext, selectedModel.value, doc_name, (chunk) => {
        if (previewContent) {
          setContent((prev: string) => {
            if (prev.includes(chunk.trim())) {
              return prev; // Return the existing content if the chunk is already included
            }
        
            let updatedContent = prev;
            for (const char of chunk.trim()) {
              updatedContent += char;
            }
            return updatedContent; // Ensure a string is always returned
          });
        }
        else {
          setMessage((prev) => {
            const updatedMessages = [...prev];
            const lastMessageIndex = updatedMessages.length - 1;
        
            if (chunk.includes(`#`)) {
              previewContent = true;
              setIsPreview(true);
        
              const lastIdx = chunk.indexOf(`#`);
        
              // Update the last message content if needed
              if (
                updatedMessages[lastMessageIndex] &&
                !updatedMessages[lastMessageIndex]?.content.includes(chunk.slice(0, lastIdx).trim())
              ) {
                for (const char of chunk.slice(0, lastIdx).trim()) {
                  updatedMessages[lastMessageIndex].content += char;
                }
              }
        
              // Safely update content
              setContent((prev: string) => {
                if (prev.includes(chunk.slice(lastIdx).trim())) {
                  return prev;
                }
                
                let updatedContent = prev;
                for (const char of chunk.slice(lastIdx).trim()) {
                  updatedContent += char;
                }
                return updatedContent;
              });
            } else {
              if (
                updatedMessages[lastMessageIndex]?.role === "assistant" &&
                updatedMessages[lastMessageIndex] &&
                !updatedMessages[lastMessageIndex]?.content.includes(chunk.trim())
              ) {
                for (const char of chunk.trim()) {
                  updatedMessages[lastMessageIndex].content += char;
                }
              }
            }
            return updatedMessages; // Ensure updatedMessages is always returned
          });
        }               
      });
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessage((prev) => {
        const updatedMessages = [...prev];
        const lastMessageIndex = updatedMessages.length - 1;
  
        if (updatedMessages[lastMessageIndex]?.role === "assistant") {
          updatedMessages[lastMessageIndex] = {
            role: "assistant",
            content: "Something went wrong. Please try again.",
          };
        }
        return updatedMessages;
      });
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

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [message]);

  const handleFocus = () => {
    textareaRef.current?.focus();
  };

  return (
    <div
      className={`w-1/2 -mt-5 rounded-lg relative transition-all duration-300 flex-1 mx-auto ${
        isPreview ? "" : "px-40"
      }`}
      onClick={handleFocus}
    >
      <div className="flex justify-between px-5 py-2 items-center">
        <div className="text-white rounded-t-lg flex gap-5 items-center justify-between h-12">
          <div className="flex items-center gap-2 text-sm bg-[#1f1f1f] cursor-pointer rounded-full p-2 ps-2.5 pe-3.5">
            <div className={`rounded-full flex-shrink-0 bg-[#8bd375] text-black font-bold flex items-center justify-center transition-all duration-150 ${isPreview ? "w-8 h-8" : "w-9 h-9 text-lg"}`}>
              {doc_name.charAt(0).toUpperCase() + doc_name.charAt(1).toUpperCase()}
            </div>
            <p className={`hover:underline truncate w-[82%] ${isPreview ? "text-xs max-w-[150px]" : "text-sm"}`}>{doc_name}</p>
          </div>

          <button className={`flex items-center gap-3 bg-[#1f1f1f] cursor-pointer rounded-full p-4 transition-all duration-150 ${isPreview ? "text-xs max-w-[175px]" : "text-sm"}`} onClick={() => setShowModel(true)}>
            <LuBrain className="text-white flex-shrink-0" size={isPreview ? 16 : 20} />
            <p className="truncate w-[75%]">{selectedModel.name}</p>
            <LuChevronDown className={`text-white transition-all duration-150 ${showModel ? "-rotate-180" : ""}`} size={isPreview ? 16 : 20} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          {message.length > 0 && (
            <button
              className={`group flex items-center gap-2 group cursor-pointer border hover:bg-[#F2BD57] hover:text-black transition-all duration-150 text-[#F2BD57] border-[#F2BD57] rounded-full p-3.5 ${isPreview ? "text-xs" : "text-sm"}`}
              onClick={handleReset}
            >
              <HiArrowPath
                className="group-focus:animate-spin transition-all duration-100"
                size={16}
              />
              <span className="group-hover:text-black transition-all duration-150">Restart Chat</span>
            </button>
          )}
        </div>
      </div>

      <div
        ref={chatContainerRef}
        className={`chat-container flex flex-col gap-2 pt-4 pb-16 overflow-y-scroll h-[calc(100vh-9.5rem)] ${
          isPreview ? "px-3" : "px-10"
        }`}
      >
        {message.map((msg, index) => (
          <Chat key={index} role={msg.role} content={msg.content} isPreview={isPreview} />
        ))}
      </div>

      <div
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 min-h-14 rounded-b-lg transition-all duration-300 w-full ${
          isPreview ? "" : " px-56"
        }`}
      >
        <div
          className={`flex items-end h-full border py-3 -mb-5 bg-[#141415] border-[#383737] transition-all duration-300 ${
            isFocused ? "w-[81%] mx-auto rounded-2xl" : "w-1/2 mx-auto rounded-full"
          }`}
        >
          <LuPaperclip className="text-[#B4B4B4] hover:text-white cursor-pointer w-14 h-5" />
          <textarea
            placeholder={isAiGenerating ? "Generating..." : !(content.length > 0) ? "Share project highlights..." : "what you'd like to improve in your README..."}
            ref={textareaRef}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="bg-transparent flex-1 h-6 text-[#ece7e7] outline-none resize-none placeholder:truncate"
            rows={1}
            disabled={isAiGenerating}
          />
          <LuSend
            className="text-[#B4B4B4] hover:text-white transform transition-all duration-200 hover:rotate-45 cursor-pointer w-14 h-5"
            onClick={handleSend}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatSection;
