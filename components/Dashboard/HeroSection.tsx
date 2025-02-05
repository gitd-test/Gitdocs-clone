"use client"

import { useUser } from "@clerk/nextjs";
import { AppContext } from "@/contexts/AppContext";
import { useContext, useState } from "react";
import { LuChevronDown, LuPlus, LuLayoutGrid, LuList } from "react-icons/lu";
import { Star } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { GitBranch } from "lucide-react";
import RepoCards from "../common/RepoCards";


interface AppContextType {
    collapsed: boolean;
}

const HeroSection = () => {

    const { user } = useUser();
    const { collapsed } = useContext(AppContext) as AppContextType;

    const initialRepositories = [
        {
            name: 'project-alpha',
            gitLink: 'https://github.com/project-alpha',
            lastUpdated: new Date('2024-03-10'),
            status: 'Needs Attention',
            recentCommitDescription: 'Added new feature',
            suggestions: 3,
            score: 75,
            visibility: 'Public',
            starred: true,
        },
        {
            name: 'beta-framework',
            gitLink: 'https://github.com/beta-framework',
            lastUpdated: new Date('2025-03-09'),
            status: 'Updated',
            recentCommitDescription: 'Added new feature',
            suggestions: 0,
            score: 95,
            visibility: 'Public',
            starred: false,
        },
        {
            name: 'gamma-project',
            gitLink: 'https://github.com/gamma-project',
            lastUpdated: new Date('2025-03-09'),
            status: 'Updated',
            recentCommitDescription: 'Added new feature',
            suggestions: 0,
            score: 100,
            visibility: 'Public',
            starred: false,
        },
    ];
    
    const [repositories, setRepositories] = useState(initialRepositories);

      const statsOverview = [
        {
            title: "Total Repositories",
            icon: <GitBranch className="w-5 h-5 text-[#0396FD]" />,
            value: repositories.length
        },
        {
            title: "Needs Attention",
            icon: <AlertCircle className="w-5 h-5 text-red-500" />,
            value: repositories.filter(r => r.status === 'Needs Attention').length
        },
        {
            title: "Updated",
            icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
            value: repositories.filter(r => r.status === 'Updated').length
        },
        {
            title: "Starred Repositories",
            icon: <Star className="w-5 h-5 text-yellow-500" />,
            value: repositories.filter(repo => repo.starred).length
        }
      ]    

      const handleStarClick = (repoName: string) => {
        console.log(`Star clicked for ${repoName}`);
        const updatedRepositories = repositories.map(repo => 
            repo.name === repoName ? { ...repo, starred: !repo.starred } : repo
        );
        setRepositories(updatedRepositories);
      }

    return (
        <div className={`flex flex-col gap-4 px-10 py-5`}>


            <div className="gap-4">
                <h1 className="text-sm5 font-bold font-raleway-dots w-fit">
                    {user 
                    ?<>
                    Welcome back, {user.fullName || user.firstName || "User"} 
                    <hr className="border-[#3D444D] mt-2" />
                    </> 
                    : null}

                </h1>
                <div className="flex items-center mt-5 justify-between">
                    <h2 className="text-3xl font-bold text-white">Overview</h2>
                    <div className="flex items-center gap-4">
                    
                    <div className="flex items-center border border-[#383737] rounded-md">
                        <button className="text-sm px-3 py-[9px] border-r border-[#383737] flex items-center gap-2 hover:bg-[#1f1f1f]">
                            <LuLayoutGrid size={16} />
                        </button>
                        <button className="text-sm px-3 py-[9px] flex items-center gap-2 hover:bg-[#1f1f1f]">
                            <LuList size={18} />
                        </button>
                    </div>

                    <button className="text-sm border border-[#383737] rounded-md px-4 py-2 flex items-center gap-2 hover:bg-[#1f1f1f]">
                        All repositories
                        <LuChevronDown size={16} />
                    </button>

                    <button className="text-sm bg-[#0791F9] hover:bg-[#3196e3] rounded-md px-4 py-2 flex items-center gap-2">
                        <LuPlus size={16} />
                    Add New Repository
                    </button>
                    </div>
                </div>

            </div>


            {/* Overview Cards */}
            {user ? (
                <>
                {/* Repository Stats Overview */}   
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {statsOverview.map((stat, index) => (
                        <div key={index} className="bg-[#171717] p-4 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                                {stat.icon}
                            </div>
                            <p className="mt-2 text-2xl font-semibold">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className={`w-full grid gap-4 ${collapsed ? "grid-cols-3" : "grid-cols-2"}`}>
                    {repositories.map((repo, index) => (
                        <RepoCards key={index} repo={repo} handleStarClick={handleStarClick} />
                    ))}
                </div>
                </>


            ) : (
                <div className="flex items-center gap-4">
                    <h3 className="font-bold">Please <span className="text-[#F8C75D]">sign in</span> to view your projects.</h3>
                </div>
            )}
        </div>

    )
}
export default HeroSection