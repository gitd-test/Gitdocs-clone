"use client"

import Sidebar from "@/components/Dashboard/Sidebar"
import HeroSection from "@/components/Dashboard/HeroSection"
import NavBar from "@/components/Dashboard/NavBar"
import { AppContext } from "@/contexts/AppContext"
import { useContext } from "react"  

interface AppContextType {
    collapsed: boolean;
    setNavbarTitle: (navbarTitle: string) => void;
    setIsSidebarUsed: (isSidebarUsed: boolean) => void;
}


const DashboardPage = () => {
  const { collapsed, setNavbarTitle, setIsSidebarUsed } = useContext(AppContext) as AppContextType;
  setNavbarTitle("Dashboard")
  setIsSidebarUsed(true)
  return (
    <div className="flex">

      <Sidebar />
      <div className={`flex-1 ${collapsed ? "ms-20" : "ms-64"} transition-all duration-300`}>
        <NavBar />
        <HeroSection />
      </div>
    </div>
  )
}

export default DashboardPage