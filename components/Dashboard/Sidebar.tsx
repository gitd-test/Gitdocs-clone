"use client";

import { useState, useEffect } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { LuUser } from "react-icons/lu";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import logo from "@/app/favicon.ico";
import { AppContext } from "@/contexts/AppContext";
import { useContext } from "react";
import { cn } from "@/lib/utils";
import Button from "@/components/common/Button";
import {
  LayoutDashboard,
  Settings,
  HelpCircle,
  BookOpen,
} from "lucide-react";

interface AppContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar() {
  const { user } = useUser();
  const { collapsed } = useContext(AppContext) as AppContextType;
  const [isClient, setIsClient] = useState(false); // Track if on client

  useEffect(() => {
    setIsClient(true); // This will ensure the content is only rendered on the client
  }, []);

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
          "h-screen bg-[#131314] border-r  border-[#3D444D] relative flex flex-col transition-all duration-300",
          collapsed ? "w-16" : "w-56"
        )}
      >

        {/* Logo Section */}
        <div className="px-4 h-16 border-b border-[#3D444D] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative mx-auto">
              <Image
                src={logo || "/default-logo.png"}
                width={30}
                height={30}
                alt="logo"
              />
              {collapsed && (
                <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-[#3D444D]" />
              )}
            </div>
            {!collapsed && (
              <span className="font-bold text-2xl text-white-900 overflow-hidden whitespace-nowrap">
                gitdocs ai
              </span>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-1.5 py-2.5 overflow-hidden">
          <ul>
            {menuItems.map((item, index) => (
              <li key={index}>
                {collapsed ? (
                  <a
                    href={item.href}
                    className="flex flex-col w-full items-center gap-1 py-1.5 mb-1 px-0.5 text-[#cfcfd1] rounded-md group origin-top hover:bg-[#232A34]"
                  >
                      <item.icon className="h-6 w-6 text-[#E8E8E9] group-hover:text-blue-600" />
                    <span className="text-[10px] font-medium group-hover:text-blue-600 text-center w-full truncate">
                      {item.label}
                    </span>
                  </a>
                ) : (
                  <a
                    href={item.href}
                    className={`flex items-center my-1 text-[#cfcfd1] gap-3 py-3 px-4 rounded-md transition-colors group hover:bg-[#232A34]`}
                  >
                      <item.icon className="h-6 w-6 text-[#E8E8E9] group-hover:text-blue-600" />

                    <span className="text-sm font-medium group-hover:text-blue-600 overflow-hidden whitespace-nowrap">
                      {item.label}
                    </span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className="py-4 px-2 border-t border-[#3D444D] bg-[#171717]">
          {collapsed ? (
            <div className="flex items-center scale-150 justify-center">
              <SignedOut>
                <SignInButton>
                <div className="h-8 w-8 rounded-full bg-[#3D444D] cursor-pointer flex items-center justify-center">
                  <LuUser size={18} />
                </div>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <div className="flex items-center gap-3 px-1">
                  <div className="flex items-center relative">
                  <div className="absolute text-[6px] left-1/2 -translate-x-1/2 px-1 z-10 -bottom-1.5 bg-[#18181B] rounded-full border-2 border-[#3D444D]">
                    Free
                  </div>
                  <UserButton />
                  </div>
                </div>
              </SignedIn>
            </div>
          ) : (
            <div className="flex items-center gap-3 h-full">
              <SignedOut>
                <div className="h-12 w-12 rounded-full bg-[#3D444D] cursor-pointer shrink-0 flex items-center justify-center">
                  <LuUser size={22} />
                </div>
                <Button variant={"default"} size={"lg"}>
                  <SignInButton />
                </Button>
              </SignedOut>

              <SignedIn>
                <div className="scale-125 flex items-center gap-3 px-5 overflow-hidden h-full">
                  <div className="flex items-center relative">
                    <div className="absolute text-[6px] left-1/2 -translate-x-1/2 px-1 z-10 -bottom-1 bg-[#18181B] rounded-full border-2 border-[#3D444D]">
                      Free
                    </div>
                  <UserButton />
                  </div>
                  <div className="text-sm font-medium transition-all duration-500 text-nowrap whitespace-nowrap">
                    {user?.fullName || user?.firstName || "User"}
                  </div>
                </div>
              </SignedIn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
