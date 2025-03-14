"use client"
// RawPreview.tsx
import React, { useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useScrollPosition } from "@/contexts/ScrollContextProvider";

const RawPreview = ({
  content,
  setContent,
}: {
  content: string;
  setContent: (content: string | ((prev: string) => string)) => void;
}) => {
  const { rawScrollPosition, setRawScrollPosition } = useScrollPosition();
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    
    // Restore scroll position when component mounts
    if (rawScrollPosition > 0) {
      setTimeout(() => {
        editor.setScrollTop(rawScrollPosition);
      }, 0);
    }

    // Add scroll listener to save position
    editor.onDidScrollChange((e: any) => {
      setRawScrollPosition(e.scrollTop);
    });
  };

  return (
    <>
      {content ? (
        <Editor
          height="calc(100vh - 8rem)"
          defaultLanguage="markdown"
          value={content.replace(/\\n/g, "\n").replace(/\\`\\`\\`/g, "```").trim()}
          onChange={(value) => {
            setContent(value || ""); 
          }}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            roundedSelection: false,
            wordWrap: "on",
            theme: "vs-dark",
          }}
        />
      ) : (
        <div className="h-[calc(100vh-11rem)] flex items-center justify-center text-gray-300">
          <p>No Preview Available</p>
        </div>
      )}
    </>
  );
};

export default RawPreview;
