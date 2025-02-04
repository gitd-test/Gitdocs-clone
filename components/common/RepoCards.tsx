import { LuFolder } from "react-icons/lu";
import { FaGithub } from "react-icons/fa";
import { Star } from "lucide-react";
import updatedAgo from "@/lib/UpdatedDate";

interface Repo {
    name: string;
    gitLink: string;
    lastUpdated: string;
    status: string;
    recentCommitDescription: string;
    suggestions: number;
    visibility: string;
    starred: boolean;
}

const RepoCards = ({ repo, handleStarClick }: { repo: Repo, handleStarClick: (repoName: string) => void }) => {


    return (
        <div className="border cursor-pointer border-[#888282] hover:border-[#3196e3] transition-all duration-150 p-4 rounded-lg shadow-sm">
            <h3 className="text-xl mb-3 flex items-center justify-between font-medium text-white">

                <div className="flex items-center gap-2">
                <LuFolder size={20} />
                {repo.name}
                <p className="text-xs rounded-full bg-[#171717] px-2 py-1 text-gray-500">{repo.visibility}</p>
                </div>
                {repo.starred ? (
                    <Star size={20} className="text-[#F8C75D] cursor-pointer" onClick={() => handleStarClick(repo.name)} />
                ) : (
                    <Star size={20} className="text-gray-500 cursor-pointer" onClick={() => handleStarClick(repo.name)} />
                )}

            </h3>

            <p className="text-xs truncate mb-3 text-white flex items-center gap-2 rounded-full bg-[#1A1A1A]  px-4 py-2 w-fit">
                <FaGithub size={16} />
                {repo.gitLink}
            </p>

            <p className="text-sm text-gray-500">
                {repo.recentCommitDescription}
            </p>
            <p className="text-sm text-gray-500 mb-3">Last Updated: {updatedAgo(new Date(repo.lastUpdated)) < 7 
            ? updatedAgo(new Date(repo.lastUpdated)) + ' days ago' 
            : 'on ' + new Date(repo.lastUpdated).toLocaleDateString()}  
             </p>


            <div className="flex items-center gap-3">
            {repo.status === 'Needs Attention' ? (
                <p className="text-sm bg-[#FEE2E2] px-2 py-0.5 rounded-full text-[#991B1B]">
                    {repo.status}
                </p>
            ) : (

                <p className="text-sm bg-[#D1FAE5] px-2 py-0.5 rounded-full text-[#166534]">
                    {repo.status}
                </p>
            )}

            {repo.suggestions > 0 && (
                <p className="text-sm bg-[#DBEAFE] px-2 py-0.5 rounded-full text-[#1E40AF]">
                    {repo.suggestions} suggestions
                </p>
            )}
            </div>
    </div>
    )
}
export default RepoCards