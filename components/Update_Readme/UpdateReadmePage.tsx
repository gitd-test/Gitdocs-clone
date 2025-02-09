"use client";

import { redirect } from "next/navigation";
import NavBar from "@/components/Dashboard/NavBar";
import { AppContext } from "@/contexts/AppContext";
import { useContext, useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import ChatSection from "@/components/Update_Readme/ChatSection";
import PreviewSection from "@/components/Update_Readme/PreviewSection";

interface AppContextType {
  setNavbarTitle: (navbarTitle: string) => void;
  setIsSidebarUsed: (isSidebarUsed: boolean) => void;
}

interface UpdateReadmePageProps {
  doc_name: string;
}

const UpdateReadmePage: React.FC<UpdateReadmePageProps> = ({ doc_name }) => {
  const { isSignedIn } = useAuth();

  const [isPreview, setIsPreview] = useState(false);
  const [content, setContent] = useState<string>("");



  const { setNavbarTitle, setIsSidebarUsed } = useContext(AppContext) as AppContextType;

  useEffect(() => {
    if (!isSignedIn) {
      redirect("/");
    }

    if (doc_name) {
      const docNameStr = Array.isArray(doc_name) ? doc_name[0] : doc_name.toString();
      setNavbarTitle(docNameStr);
      setIsSidebarUsed(false);
    }
  }, [doc_name, isSignedIn, setNavbarTitle, setIsSidebarUsed]);

  return (
    <>
      <NavBar />
      <div className="p-6 gap-6 flex h-[calc(100vh-64px)] overflow-hidden">
        <ChatSection doc_name={doc_name as string} isPreview={isPreview} setIsPreview={setIsPreview} setContent={setContent} />
        <PreviewSection isPreview={isPreview} setIsPreview={setIsPreview} content={content} setContent={setContent} />
      </div>
    </>


  );
};

export default UpdateReadmePage;
