import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownPreview = ({ content }: { content: string }) => {
  // Clean and preprocess content
  const cleanContent = content
  .replace(/\\n/g, "\n") // Replace escaped newlines with actual newlines
  .trim();


  return (
    <>
    {content ? <div className="h-[calc(100vh-10rem)] markdown bg-transparent text-[#e0e3e7] focus:outline-none w-full p-4 resize-none rounded-b-lg overflow-y-auto">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{cleanContent}</ReactMarkdown>
    </div>  : 
          <div className="h-[calc(100vh-15rem)] flex items-center justify-center">
            <p>No Preview Available</p>
        </div>}
    </>
  );
};

export default MarkdownPreview;
