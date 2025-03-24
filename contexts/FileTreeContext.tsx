"use client";

import { createContext, useState, Dispatch, SetStateAction } from "react";

export type FileTreeContextType = {
  selectedFiles: string[];
  setSelectedFiles: Dispatch<SetStateAction<string[]>>;
  initialTree: any[];
  setInitialTree: Dispatch<SetStateAction<any[]>>;
  allFilePaths: string[];
  setAllFilePaths: Dispatch<SetStateAction<string[]>>;
  fileTreeError: string;
  setFileTreeError: Dispatch<SetStateAction<string>>;
};

export const FileTreeContext = createContext<FileTreeContextType | undefined>(undefined);

export const FileTreeProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedFiles, setSelectedFiles] = useState<string[]>(["README.md", "package.json"]);
  const [initialTree, setInitialTree] = useState<any[]>([]);
  const [allFilePaths, setAllFilePaths] = useState<string[]>([]);
  const [fileTreeError, setFileTreeError] = useState("");

  return (
    <FileTreeContext.Provider
      value={{
        selectedFiles,
        setSelectedFiles,
        initialTree,
        setInitialTree,
        allFilePaths,
        setAllFilePaths,
        fileTreeError,
        setFileTreeError,
      }}
    >
      {children}
    </FileTreeContext.Provider>
  );
};
