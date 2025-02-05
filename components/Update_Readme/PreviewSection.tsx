import { LuGitPullRequestArrow } from "react-icons/lu"

const PreviewSection = () => {
  return (
    <div className='w-1/2 bg-[#171717] rounded-lg'>
        <h1 className='text-white bg-[#171717] rounded-t-lg flex items-center justify-between px-5 h-12'>
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