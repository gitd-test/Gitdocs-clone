"use client"

import { createContext, Dispatch, SetStateAction, useState, useEffect } from "react";


interface AppContextType {
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
  navbarTitle: string;
  setNavbarTitle: Dispatch<SetStateAction<string>>;
  isSidebarUsed: boolean;
  setIsSidebarUsed: Dispatch<SetStateAction<boolean>>;
  gridView: boolean;
  setGridView: Dispatch<SetStateAction<boolean>>;
}




export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [navbarTitle, setNavbarTitle] = useState<string>("");
  const [isSidebarUsed, setIsSidebarUsed] = useState<boolean>(false);
  const [gridView, setGridView] = useState<boolean>(true);

  useEffect(() => {
    if (localStorage.getItem("gridView")) {
      setGridView(localStorage.getItem("gridView") === "true");
    } else {
      setGridView(true);
    }
  }, []);


  return (
    <AppContext.Provider value={{ collapsed, setCollapsed, navbarTitle, setNavbarTitle, isSidebarUsed, setIsSidebarUsed, gridView, setGridView }}>
      {children}
    </AppContext.Provider>
  );
};
