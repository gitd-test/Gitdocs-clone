"use client";

import { useState, useEffect, useContext, Dispatch, SetStateAction } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { LuUser } from "react-icons/lu";
import Image from "next/image";
import logo from "@/app/favicon.ico";
import { cn } from "@/lib/utils";
import { AppContext } from "@/contexts/AppContext";
import {
  LayoutDashboard,
  Settings,
  HelpCircle,
  BookOpen,
} from "lucide-react";

interface User {
  subscriptionType: string;
  stepsCompleted: number;
}

interface AppContextType {
  storedUser: User | null;
  setStoredUser: Dispatch<SetStateAction<User | null>>;
}

export default function Sidebar() {
  const [isClient, setIsClient] = useState(false); // Track if on client
  const { storedUser } = useContext(AppContext) as AppContextType;

  useEffect(() => {
    setIsClient(true); // This will ensure the content is only rendered on the client
  }, []);

  const cleanLocalStorage = () => {
    localStorage.removeItem("repositories");
    localStorage.removeItem("staleTime");
    return null;
  }

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", image: false, href: "#" },
    { icon: BookOpen, label: "Documentation", image: false, href: "#" },
    { icon: Settings, label: "Settings", image: false, href: "#" },
    { icon: HelpCircle, label: "Help & Support", image: false, href: "#" },
  ];

  if (!isClient) {
    return null; // Avoid rendering the Sidebar until client-side data is available
  }

  return (
    <div className="min-h-screen md:flex fixed top-0 left-0 hidden">
      <div
        className={cn(
          "h-screen bg-[#131314] border-r w-16 border-[#3D444D] relative flex flex-col transition-all duration-300",
        )}
      >

        {/* Logo Section */}
        <div className="px-4 h-16 border-b border-[#3D444D] flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="relative mx-auto">
              <Image
                src={logo || "/default-logo.png"}
                width={30}
                height={30}
                alt="logo"
              />
            <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-[#3D444D]" />
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-1.5 py-2.5 overflow-hidden">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index}>
                  <a
                    href={item.href}
                    className="flex flex-col w-full items-center gap-1 py-1.5 mb-1 px-0.5 text-[#cfcfd1] rounded-md group origin-top focus:bg-[#192336] hover:bg-[#232A34]"
                  >
                      <item.icon className="h-6 w-6 text-[#E8E8E9] group-focus:text-blue-600" />
                    <span className="text-[10px] font-medium group-focus:text-blue-600 text-center w-full truncate">
                      {item.label}
                    </span>
                  </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className="py-4 px-2 border-t border-[#3D444D] bg-[#171717]">
          <div className="flex items-center scale-150 justify-center">
            <SignedOut>
              <SignInButton>
              <div className="h-7 w-7 rounded-full bg-[#3D444D] cursor-pointer flex items-center justify-center">
                <LuUser size={15} />
              </div>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-3 px-1">
                <div className="flex items-center relative scale-90">
                <div className="absolute text-[6px] left-1/2 -translate-x-1/2 px-1 z-10 -bottom-1.5 bg-[#18181B] rounded-full border-2 border-[#3D444D]">
                  {storedUser?.subscriptionType}
                </div>
                <UserButton />
                </div>
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </div>
  );
}
