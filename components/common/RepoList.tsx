import { LuFolder } from "react-icons/lu";
import { FaGithub } from "react-icons/fa";
import { Star } from "lucide-react";
import updatedAgo from "@/lib/UpdatedDate";
import RepoTools from "./RepoTools";
import Link from "next/link";

interface Repo {
    name: string;
    gitLink: string;
    lastUpdated: string;
    status: string;
    recentCommitDescription: string;
    suggestions: number;
    visibility: string;
    starred: boolean;
    score: number;
}

const RepoList = ({ repo, handleStarClick }: { repo: Repo, handleStarClick: (repoName: string) => void }) => {

    return (
        <div className="border border-[#232323] hover:border-[#3196e3] transition-all duration-150 overflow-hidden px-6 py-5 rounded-lg shadow-sm flex justify-between">
            <div className="flex-col font-medium text-[#dedbdb] w-[30%]">
                <div className="flex items-center gap-2">

                <LuFolder size={20} />
                <p className="truncate ">{repo.name}</p>
                <p className="text-xs rounded-full bg-[#171717] px-2 py-1 text-gray-500">{repo.visibility}</p>
                </div>

                <Link 
                href={repo.gitLink} 
                target="_blank" 
                className="text-[#aea9a9] text-sm mt-3 flex items-center gap-2 rounded-full hover:underline w-fit"
                >
                <FaGithub size={16} />
                <p className="truncate text-xs">{repo.gitLink.split('github.com/')[1]}</p>  {/* Extract username/repository */}
                </Link>

            </div>

            <div className="w-[35%] flex flex-col justify-center">

            <p className="text-xs text-gray-500 truncate">
                {repo.recentCommitDescription || 'No recent commit description'}

            </p>
            <p className="text-xs text-gray-500 mb-3">{updatedAgo(new Date(repo.lastUpdated)) < 7 
            ? updatedAgo(new Date(repo.lastUpdated)) + ' days ago' 
            : 'on ' + new Date(repo.lastUpdated).toLocaleDateString()}  
             </p>

             </div>

            <div className="w-[16%] flex flex-col justify-between items-end">
            {repo.starred ? (
                    <Star size={20} className="text-[#F8C75D] cursor-pointer" onClick={() => handleStarClick(repo.name)} />
                ) : (
                    <Star size={20} className="text-gray-500 cursor-pointer" onClick={() => handleStarClick(repo.name)} />
                )}
            <RepoTools doc_name={repo.name} doc_score={repo.score} />
            </div>
        </div>


    )
}
export default RepoList;