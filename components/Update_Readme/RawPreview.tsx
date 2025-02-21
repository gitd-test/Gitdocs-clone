const RawPreview = ({
    content,
    setContent,
}: {
    content: string;
    setContent: (content: string | ((prev: string) => string)) => void;
}) => {
    return (
        <textarea
            className="h-[calc(100vh-10rem)] bg-transparent text-[#e0e3e7] focus:outline-none w-full p-4 resize-none rounded-b-lg overflow-y-auto whitespace-pre-wrap"
            value={content.replace(/\\n/g, "\n").replace(/You can view the changes in the preview section\./g, "")}
            onChange={(e) => {
                setContent(e.target.value.replace(/\n/g, "\\n"));
            }}
        />

    );
};

export default RawPreview;
