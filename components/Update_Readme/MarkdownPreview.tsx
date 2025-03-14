"use client"
// MarkdownPreview.tsx
import React, { useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useScrollPosition } from "@/contexts/ScrollContextProvider";

const MarkdownPreview = ({ content }: { content: string }) => {
  const { markdownScrollPosition, setMarkdownScrollPosition } = useScrollPosition();
  const containerRef = useRef<HTMLDivElement>(null);

  // Clean and preprocess content
  const cleanContent = content
    .replace(/\\n/g, "\n")
    .replace(/\\`\\`\\`/g, "```")
    .trim();

  useEffect(() => {
    // Restore scroll position when component mounts
    if (containerRef.current && markdownScrollPosition > 0) {
      containerRef.current.scrollTop = markdownScrollPosition;
    }
  }, [markdownScrollPosition]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setMarkdownScrollPosition(e.currentTarget.scrollTop);
  };

  return (
    <>
      {content ? (
        <div 
          ref={containerRef}
          className="h-[calc(100vh-8rem)] markdown bg-transparent text-[#e0e3e7] focus:outline-none w-full p-4 resize-none rounded-b-lg overflow-y-auto"
          onScroll={handleScroll}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {cleanContent}
          </ReactMarkdown>
        </div>
      ) : (
        <div className="h-[calc(100vh-11rem)] flex items-center justify-center">
          <p>No Preview Available</p>
        </div>
      )}
    </>
  );
};

export default MarkdownPreview;
