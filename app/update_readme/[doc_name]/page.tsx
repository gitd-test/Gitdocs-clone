"use client"

import { useRouter, useParams, redirect } from 'next/navigation';
import NavBar from '@/components/Dashboard/NavBar';
import { AppContext } from '@/contexts/AppContext';
import { useContext } from 'react';
import { useAuth } from '@clerk/nextjs';
import ChatSection from '@/components/Update_Readme/ChatSection';
import PreviewSection from '@/components/Update_Readme/PreviewSection';

interface AppContextType {
  setNavbarTitle: (navbarTitle: string) => void;
  setIsSidebarUsed: (isSidebarUsed: boolean) => void;
}

interface UpdateReadmeProps {
  doc_name: string;
}

const UpdateReadmePage: React.FC<UpdateReadmeProps> = () => {

  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    redirect('/');
  }

  const router = useRouter();
  const { doc_name } = useParams();
  const { setNavbarTitle, setIsSidebarUsed } = useContext(AppContext) as AppContextType;
  setNavbarTitle(doc_name as string)
  setIsSidebarUsed(false)


  if (!router) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavBar />
      <div className='p-6 gap-6 flex h-[calc(100vh-64px)]'>
        <ChatSection doc_name={doc_name as string} />
        <PreviewSection />
      </div>

    </>
  );
} 

export default UpdateReadmePage;
