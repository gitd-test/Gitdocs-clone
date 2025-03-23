"use client"

import { createContext, useState } from "react";

export type FileTreeContextType = {
  selectedFiles: string[];
  setSelectedFiles: (selectedFiles: string[]) => void;
  initialTree: any[];
  setInitialTree: (initialTree: any[]) => void;
  allFilePaths: string[];
  setAllFilePaths: (allFilePaths: string[]) => void;
  fileTreeError: string;
  setFileTreeError: (fileTreeError: string) => void;
};

export const FileTreeContext = createContext<FileTreeContextType | undefined>(undefined);

export const FileTreeProvider = ({ children }: { children: React.ReactNode }) => {

    const [selectedFiles, setSelectedFiles] = useState<string[]>(["README.md", "package.json"]);
    const [initialTree, setInitialTree] = useState<any[]>([]);
    const [allFilePaths, setAllFilePaths] = useState<string[]>([]);
    const [fileTreeError, setFileTreeError] = useState("");


    return (
        <FileTreeContext.Provider 
            value={{ selectedFiles, setSelectedFiles, initialTree, setInitialTree, allFilePaths, setAllFilePaths, fileTreeError, setFileTreeError }}>
            {children}
        </FileTreeContext.Provider>
    );
};