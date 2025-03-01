"use client";

import { redirect } from "next/navigation";
import NavBar from "@/components/Dashboard/NavBar";
import { AppContext } from "@/contexts/AppContext";
import { useContext, useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import ChatSection from "@/components/Update_Readme/ChatSection";
import PreviewSection from "@/components/Update_Readme/PreviewSection";
import ChooseModel from "@/components/Update_Readme/ChooseModel";

interface User {
  subscriptionType: string;
  stepsCompleted: number;
}

interface AppContextType {
  setNavbarTitle: (navbarTitle: string) => void;
  setIsSidebarUsed: (isSidebarUsed: boolean) => void;
  showModel: boolean;
  storedUser: User;
  setStopAllActions: (stopAllActions: boolean) => void;
}

interface UpdateReadmePageProps {
  doc_name: string;
}

const UpdateReadmePage: React.FC<UpdateReadmePageProps> = ({ doc_name }) => {
  const { isSignedIn } = useAuth();

  const [isPreview, setIsPreview] = useState(false);
  const [content, setContent] = useState<string>("");

  const { setNavbarTitle, setIsSidebarUsed, showModel, storedUser, setStopAllActions } = useContext(AppContext) as AppContextType;

  useEffect(() => {
    setStopAllActions(false);
  }, [setStopAllActions]);

  const modelProviders = [
    {
      name: "Gemini",
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={38} height={38} color={"#FFFFFF"} fill={"none"}>
                <path d="M3 12C7.97056 12 12 7.97056 12 3C12 7.97056 16.0294 12 21 12C16.0294 12 12 16.0294 12 21C12 16.0294 7.97056 12 3 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>,
      description: "Best for small and personal projects",
      isAvailable: true,
    },
    {
      name: "ChatGPT",
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={38} height={38} color={"#FFFFFF"} fill={"none"}>
                <path d="M11.7453 14.85L6.90436 12V7C6.90436 4.79086 8.72949 3 10.9809 3C12.3782 3 13.6113 3.6898 14.3458 4.74128" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9.59961 19.1791C10.3266 20.2757 11.5866 21.0008 13.0192 21.0008C15.2707 21.0008 17.0958 19.21 17.0958 17.0008V12.0008L12.1612 9.0957" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9.45166 13.5L9.45123 7.66938L13.8642 5.16938C15.814 4.06481 18.3072 4.72031 19.4329 6.63348C20.1593 7.86806 20.1388 9.32466 19.5089 10.4995" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4.48963 13.4993C3.8595 14.6742 3.83887 16.131 4.56539 17.3657C5.6911 19.2789 8.18428 19.9344 10.1341 18.8298L14.5471 16.3298L14.643 10.7344" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M17.0959 17.6309C18.4415 17.5734 19.7295 16.8634 20.4529 15.634C21.5786 13.7209 20.9106 11.2745 18.9608 10.1699L14.5478 7.66992L9.48907 10.4255" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6.90454 6.36938C5.55865 6.42662 4.27032 7.13672 3.54684 8.3663C2.42113 10.2795 3.08917 12.7258 5.03896 13.8304L9.45196 16.3304L14.5 13.5807" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>,
      description: "Best for small to medium projects",
      isAvailable: storedUser?.subscriptionType === "Pro" || storedUser?.subscriptionType === "Enterprise"
    },
    {
      name: "Claude",
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={38} height={38} color={"#FFFFFF"} fill={"none"}>
                <path d="M13 12L18.5 5M7.63965 3L12.5 12L13.6865 3M4.48381 6.71679L11.9872 12M3 12L11.9872 12.473M12.2244 13.177L7 20M4.84194 16.8682L11.2824 12.9758M11.5 21L12.665 13.177M21 14L13.1846 12.668M21 10.5788L13 12.3223M16.779 19.646L12.8876 13.3772M19.3566 18.207L13.313 12.9893" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>,
      description: "Best for small to medium projects",
      isAvailable: storedUser?.subscriptionType === "Pro" || storedUser?.subscriptionType === "Enterprise"
    },
    {
      name: "DeepSeek",
      icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={38} height={38} color={"#FFFFFF"} fill={"none"}>
                <path d="M20.7251 6.16595C19.5974 6.16595 18.9538 6.95202 18.9538 6.95202C18.7384 5.92858 18.095 5.6278 17.3608 5.28691C16.8965 5.07135 16.702 4.59085 16.6387 4.2437C16.6146 4.11149 16.5055 4.00308 16.3711 4.00308C16.237 4.00308 16.1093 4.05921 16.0445 4.17662C15.9059 4.42748 15.6911 4.97621 15.672 5.98711C15.6435 7.48962 16.8825 8.64855 17.5056 9.04019C17.4415 9.41048 17.216 9.98242 17.1112 10.2221C16.7962 10.1096 15.9376 9.74732 15.2402 8.98763C14.2834 7.94536 13.5027 7.20684 12.4854 6.4845C11.4681 5.76216 12.1483 4.90154 12.5757 4.69688C13.003 4.49221 12.678 4.28196 11.6125 4.31808C10.7602 4.34697 9.54607 4.84808 9.04556 5.09502C8.53523 4.93292 7.47442 4.90065 7.00781 4.90478C2.42529 4.90478 1.0006 8.98014 1.0006 11.0006C1.0006 17.0868 5.87378 20.0006 9.37378 20.0006C13.3324 20.0006 14.7193 18.3865 14.7193 18.3865C14.8826 18.4882 15.4787 18.7032 16.5574 18.749C17.9058 18.8062 18.4082 18.4246 18.4464 18.1321C18.4845 17.8395 18.2683 17.7314 18.0775 17.6423C17.8867 17.5533 17.5878 17.3816 17.0217 17.1971C16.5689 17.0496 16.3652 16.889 16.3199 16.8272C19.0501 14.3553 19.5503 10.8921 19.473 9.4203C21.5848 9.33823 22.4164 7.93216 22.69 7.22092C22.9696 6.49381 23.1441 5.50412 22.8541 5.27981C22.6221 5.10036 22.4281 5.31649 22.3601 5.44699C21.9885 5.84344 21.7159 6.16595 20.7251 6.16595Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M11.9998 10.5684C11.9998 10.5684 12.8758 10.2982 13.6446 10.823C14.6861 11.5338 14.9998 12.4988 14.9998 12.4988" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13.5 16.4987C13.5 16.4987 12.4587 15.9918 10.8957 13.9604C9.01764 11.5195 7.24874 8.88553 3.52946 9.7468C3.52946 9.7468 3.50016 14.9979 8.50002 16.4987" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>,
      description: "Best for small to medium projects",
      isAvailable: storedUser?.subscriptionType === "Pro" || storedUser?.subscriptionType === "Enterprise"
    },
  ];

  useEffect(() => {
    if (!isSignedIn) {
      redirect("/dashboard");
    }

    if (doc_name) {
      const docNameStr = Array.isArray(doc_name) ? doc_name[0] : doc_name.toString();
      setNavbarTitle(docNameStr);
      setIsSidebarUsed(false);
    }
  }, [doc_name, isSignedIn, setNavbarTitle, setIsSidebarUsed]);

  return (
    <div className="bg-[#0D0D0D] text-[#EDEDED]">
      <NavBar />
      <div className="p-6 gap-6 flex h-[calc(100vh-64px)] overflow-hidden">
        <ChatSection doc_name={doc_name as string} isPreview={isPreview} setIsPreview={setIsPreview} content={content} setContent={setContent} />
        <PreviewSection isPreview={isPreview} setIsPreview={setIsPreview} content={content} setContent={setContent} />
      </div>
      {showModel && <ChooseModel modelProviders={modelProviders} />}
    </div>
  );
};

export default UpdateReadmePage;
