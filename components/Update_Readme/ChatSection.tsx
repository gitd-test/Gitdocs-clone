"use client"
import { LuChevronDown, LuPaperclip, LuSend } from "react-icons/lu";
import { useState, useRef } from "react";

interface ChatSectionProps {    
    doc_name: string;
}

const ChatSection = ({ doc_name }: ChatSectionProps) => {

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [message, setMessage] = useState("");

    const handleSend = () => {
        console.log(message);
    }

    const handleInput = () => {
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto"; // Reset the height
          textareaRef.current.style.height = `${Math.min(
            textareaRef.current.scrollHeight,
            3 * parseFloat(getComputedStyle(textareaRef.current).lineHeight || "20")
          )}px`;
        }
      };

    return (
        <div className='w-1/2 bg-[#212121] rounded-lg relative'>
            <div className="flex justify-between px-5 items-center">
                <h1 className='text-white rounded-t-lg flex gap-2 items-center justify-between h-12'>Update README:

                    <div className="flex items-center text-sm border border-[#383737] hover:bg-[#1f1f1f] cursor-pointer rounded-full py-1.5 px-4">
                        {doc_name}
                    </div>
                </h1>

                <button className="text-black text-sm flex items-center gap-2 cursor-pointer bg-[#F2BD57] rounded-lg py-1 px-3">
                <LuChevronDown size={16} />
                <span>Select Method</span>
            </button>

            </div>
            <hr className='border-[#383737]' />
            <div className="absolute bottom-0 py-4 left-0 w-full min-h-14 bg-[#303030] rounded-b-lg">
                <div className="flex items-end h-full">
                    <LuPaperclip className="text-[#B4B4B4] hover:text-white cursor-pointer w-14 h-5" />
                    <textarea placeholder="Ask a follow up question" ref={textareaRef} onInput={handleInput} className="bg-transparent flex-1 h-6 text-white outline-none resize-none" rows={1} />
                    <LuSend className="text-[#B4B4B4] hover:text-white cursor-pointer w-14 h-5" />
                </div>
            </div>
        </div>
    )
}

export default ChatSection