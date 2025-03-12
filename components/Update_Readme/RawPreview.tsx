const RawPreview = ({
    content,
    setContent,
}: {
    content: string;
    setContent: (content: string | ((prev: string) => string)) => void;
}) => {
    return (
        <>

        {content ? <textarea
            className="h-[calc(100vh-10rem)] bg-transparent text-[#e0e3e7] focus:outline-none w-full p-4 resize-none rounded-b-lg overflow-y-auto whitespace-pre-wrap"
            value={content.replace(/\\n/g, "\n")}
            onChange={(e) => {
                setContent(e.target.value
                    .replace(/\\n/g, "\n")
                    .trim());
            }}
        /> : 
        <div className="h-[calc(100vh-15rem)] flex items-center justify-center">
            <p>No Preview Available</p>
        </div>}

        </>
    );
};

export default RawPreview;
