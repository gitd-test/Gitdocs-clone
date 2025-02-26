"use client";

import Sidebar from "@/components/Dashboard/Sidebar";
import HeroSection from "@/components/Dashboard/HeroSection";
import NavBar from "@/components/Dashboard/NavBar";
import { AppContext } from "@/contexts/AppContext";
import { useContext, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

interface AppContextType {
  setNavbarTitle: (navbarTitle: string) => void;
  setIsSidebarUsed: (isSidebarUsed: boolean) => void;
}

const DashboardPage = () => {
  const { setNavbarTitle, setIsSidebarUsed } = useContext(AppContext) as AppContextType;

  const { user } = useUser();

  // Update state in useEffect to avoid updating during render
  useEffect(() => {
    if (user) {
      setNavbarTitle("Dashboard");
    } else {
      setNavbarTitle("Getting Started");
    }
    setIsSidebarUsed(true);
  }, [setNavbarTitle, setIsSidebarUsed, user]);

  return (
    <div className="flex relative z-30">
      <Sidebar />
      <div className={`flex-1 ms-16 transition-all duration-300 relative -z-10`}>
        <NavBar />
        <div className="max-w-[1600px] mx-auto">
        <HeroSection />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
