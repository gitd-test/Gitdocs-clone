"use client"

import { LuGitPullRequestArrow, LuArrowLeft, LuArrowRight } from "react-icons/lu"

interface PreviewSectionProps {
    isPreview: boolean;
    setIsPreview: (isPreview: boolean) => void;
}

const PreviewSection = ({ isPreview, setIsPreview }: { isPreview: boolean, setIsPreview: (isPreview: boolean) => void }) => {
  return (
    <div className={`bg-[#171717] rounded-lg relative ${isPreview ? 'translate-x-0 w-1/2' : 'translate-x-[104%] w-0'} transition-all duration-300`}>
        <button className={`absolute top-1/2 -translate-y-1/2 h-12 w-12 bg-[#171717] ps-1 rounded-l-lg flex items-center justify-start text-slate-400 z-10 transition-all duration-300 ${isPreview ? '-left-5' : '-left-0'}`} onClick={() => setIsPreview(!isPreview)} > 
            {isPreview ? <LuArrowRight size={16} /> : <LuArrowLeft size={16} />}
        </button>

        <h1 className={`text-white bg-[#171717] rounded-t-lg flex items-center justify-between px-5 h-12 transition-all duration-300 ${isPreview ? 'block' : 'hidden'}`}>
            <div className="flex items-center gap-2">
                <span>Preview README: </span>

                <div className="flex items-center border border-[#383737] rounded-full p-1">
                    <button className="text-sm px-3 py-0.5 flex items-center rounded-full hover:bg-[#1f1f1f]">
                        Raw
                    </button>
                    <button className="text-sm px-3 py-0.5 flex gap-2 items-center rounded-full hover:bg-[#1f1f1f]">
                        Markdown
                    </button>
                </div>
            </div>
            <button className="text-white text-sm flex items-center gap-2 cursor-pointer bg-[#3196E3] rounded-lg py-1 px-3">
                <LuGitPullRequestArrow size={16} />
                <span>Commit Changes</span>
            </button>
        </h1>
        <hr className='border-[#383737]' />
    </div>

  )
}
export default PreviewSection