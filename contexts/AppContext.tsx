"use client"

import { createContext, Dispatch, SetStateAction, useState, useEffect } from "react";

interface User {
  subscriptionType: string;
  stepsCompleted: number;
}
interface AppContextType {
  storedUser: User | null;
  setStoredUser: Dispatch<SetStateAction<User | null>>;
  navbarTitle: string;
  setNavbarTitle: Dispatch<SetStateAction<string>>;
  isSidebarUsed: boolean;
  setIsSidebarUsed: Dispatch<SetStateAction<boolean>>;
  gridView: boolean;
  setGridView: Dispatch<SetStateAction<boolean>>;
  repositoriesUpdated: boolean;
  setRepositoriesUpdated: Dispatch<SetStateAction<boolean>>;
}

export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storedUser, setStoredUser] = useState<User | null>(null);
  const [navbarTitle, setNavbarTitle] = useState<string>("");
  const [isSidebarUsed, setIsSidebarUsed] = useState<boolean>(false);
  const [gridView, setGridView] = useState<boolean>(true);
  const [repositoriesUpdated, setRepositoriesUpdated] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("gridView")) {
      setGridView(localStorage.getItem("gridView") === "true");
    } else {
      setGridView(true);
    }

  }, []);


  return (
    <AppContext.Provider value={{ storedUser, setStoredUser, navbarTitle, setNavbarTitle, isSidebarUsed, setIsSidebarUsed, gridView, setGridView, repositoriesUpdated, setRepositoriesUpdated }}>
      {children}
    </AppContext.Provider>
  );
};
