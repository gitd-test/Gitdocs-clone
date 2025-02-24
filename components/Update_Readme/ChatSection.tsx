"use client";

import { LuPaperclip, LuSend } from "react-icons/lu";
import { HiArrowPath } from "react-icons/hi2";
import { useState, useRef, useEffect } from "react";
import Chat from "./Chat";
import { fetchStreamedResponse } from "@/lib/fetchStreamedAiResponse";
import { useUser } from "@clerk/nextjs";

interface ChatSectionProps {
  doc_name: string;
  isPreview: boolean;
  setIsPreview: (isPreview: boolean) => void;
  content: string;
  setContent: (content: string | ((prev: string) => string)) => void;
}

const ChatSection = ({ doc_name, isPreview, content, setContent, setIsPreview }: ChatSectionProps) => {
  const { user } = useUser();

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
      await fetchStreamedResponse(user?.id || "", promptWithContext, doc_name, (chunk) => {
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
        isPreview ? "" : "w-full"
      }`}
      onClick={handleFocus}
    >
      <div className="flex justify-between px-5 py-2 items-center">
        <h1 className="text-white rounded-t-lg flex gap-2 items-center justify-between h-12">
          Update README:
          <div className="flex items-center text-sm border border-[#383737] hover:bg-[#1f1f1f] cursor-pointer rounded-full py-1.5 px-4">
            {doc_name}
          </div>
        </h1>
        <div className="flex items-center gap-2">
          {message.length > 0 && (
            <button
              className="text-sm group flex items-center gap-2 cursor-pointer border text-[#F2BD57] border-[#F2BD57] rounded-lg py-1 px-3"
              onClick={handleReset}
            >
              <HiArrowPath
                className="group-focus:animate-spin transition-all duration-300"
                size={16}
              />
              <span>Reset</span>
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
