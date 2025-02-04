"use client"

import { createContext, Dispatch, SetStateAction, useState } from "react";


interface AppContextType {
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
}

export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  return (
    <AppContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </AppContext.Provider>
  );
};
