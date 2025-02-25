"use client"

import { useState } from "react";
import {
  HelpCircle,
  BookOpen,
  CreditCard,
} from "lucide-react";

const GettingStarted = () => {
  const [isactive, setIsactive] = useState(false);
  return (
    <>
    <div className="bg-[#151616] h-80 rounded-xl w-full -mt-5 overflow-visible [clip-path:ellipse(100%_100%_at_center_top)]">
    </div>
    <div className="absolute h-[27rem] w-2/3 rounded-xl flex justify-center items-center bg-[#141414] left-[52.5%] border border-[#242424] -mt-14 top-0 transform -translate-x-1/2 translate-y-1/2">
      <div className="flex flex-col pt-16 justify-center items-center h-[92.7%] w-[96.7%] mt-0.5 bg-[#1a1b1b] rounded-xl border border-[#242424]">
        <h1 className="text-white text-3xl font-semibold tracking-wide">Hii there 👋, let's get started:</h1>
        <ol className="mt-6 list-decimal flex flex-col gap-1 items-center">
          <li className={isactive ? `text-white text-lg tracking-wide` : "line-through text-sm tracking-tight"}>Start by creating a new account on Gitdocs ai</li>
          <li className={isactive ? `text-white text-lg tracking-wide` : "text-white text-lg tracking-wide"}>Add your github repository</li>
          <li className={isactive ? `text-white text-lg tracking-wide` : "text-sm tracking-tight"}>Start generating readme files</li>
        </ol>
        <button className="bg-[#0078d4] mt-8 text-white px-7 py-1.5 rounded-md">Get Started</button>

        <div className="flex justify-center gap-8 items-center mt-14">
          <button className={`text-[0.9rem] border-[#383737] flex gap-2 items-center hover:text-white hover:bg-[#282829] transion-all duration-100 px-5 py-2 rounded-md -ms-1`}>
            <BookOpen size={16} />
            <span className="text-[0.9rem]">Read the docs</span>
          </button>
          <button className={`text-[0.9rem] border-[#383737] flex gap-2 items-center hover:text-white hover:bg-[#282829] transion-all duration-100 px-5 py-2 rounded-md -ms-1`}>
            <CreditCard size={16} />
            <span className="text-[0.9rem]">Add tokens</span>
          </button>
          <button className={`text-[0.9rem] border-[#383737] flex gap-2 items-center hover:text-white hover:bg-[#282829] transion-all duration-100 px-5 py-2 rounded-md -ms-1`}>
            <HelpCircle size={16} />
            <span className="text-[0.9rem]">Help & Support</span>
          </button>
        </div>
      </div>
    </div>
  </>

  );
};
export default GettingStarted;
