'use client'

import { LuHistory } from "react-icons/lu"
import { TfiWrite } from "react-icons/tfi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoadingAnimation from "./LoadingAnimation";
const RepoTools = ({ doc_name, doc_score }: { doc_name: string, doc_score: number }) => {

    const [loading, setLoading] = useState(false)

    const router = useRouter();

    const handleUpdateReadme = () => {
        if (doc_name) {
            setLoading(true)
            router.push(`/update_readme/${doc_name}`);
        } else {
            console.error("doc_name is undefined or empty");
        }
    }

    const docScoreColor = () => {

        if (doc_score === 100) {
            return "text-[#0686DF]"
        } else if (doc_score > 80 && doc_score < 100) {
            return "text-[#209C4D]"
        } else if (doc_score > 60 && doc_score <= 80) {
            return "text-[#F8C75D]"
        }else if (doc_score > 0 && doc_score <= 50) {
            return "text-[#EF4444]"
        } else {
            return "text-[#383737]"
        }
    }

    return (
        <div className="flex items-center mt-3 justify-between">
            <div className="flex items-center">
            <button className="text-sm px-3 py-[9px] border-r border-[#383737] flex items-center hover:bg-[#1f1f1f]" onClick={() => {
                window.open(`https://github.com/${doc_name}`, '_blank')
            }}>
                <LuHistory size={16} />
            </button>


            <button className="text-sm px-3 py-[9px] border-r border-[#383737] flex gap-2 items-center hover:bg-[#1f1f1f]" onClick={() => {
                handleUpdateReadme()
            }}>
                
            {loading 
            ? 
            <>
            <LoadingAnimation /> 
            <span className="text-sm">Updating...</span>
            </>
            : 
            <>
            <TfiWrite size={16} />
            <span className="text-sm">Update Readme</span>
            </>
            }

            </button>

            </div>
            <p className="text-sm text-gray-500">

                Doc Score: <span className={docScoreColor()}>{doc_score}</span>

            </p>
        </div>
    )
}

export default RepoTools