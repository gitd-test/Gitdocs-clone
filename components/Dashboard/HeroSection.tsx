"use client";

import { useUser } from "@clerk/nextjs";
import { AppContext } from "@/contexts/AppContext";
import { useContext, useEffect, useState, Dispatch, SetStateAction } from "react";
import { LuPlus, LuLayoutGrid, LuList } from "react-icons/lu";
import { Star } from "lucide-react";
import { CheckCircle2 } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { GitBranch } from "lucide-react";
import RepoCards from "../common/RepoCards";
import LoadingAnimation from "../common/LoadingAnimation";
import { SignInButton } from "@clerk/nextjs"
import axios from "axios";
import RepoList from "../common/RepoList";
interface Repository {
  name: string;
  gitLink: string;
  lastUpdated: string;
  status: string;
  recentCommitDescription: string;
  starred: boolean;
}

interface AppContextType {
  collapsed: boolean;
  gridView: boolean;
  setGridView: Dispatch<SetStateAction<boolean>>;
}


const HeroSection = () => {
  const { user } = useUser();
  const { collapsed, gridView, setGridView } = useContext(AppContext) as AppContextType;
  const [repositoriesLoading, setRepositoriesLoading] = useState(false);
  const [repositories, setRepositories] = useState<Repository[]>([]); // Explicitly typed as Repository[] 

  useEffect(() => {
    if (user) {
      setRepositoriesLoading(true);
      axios.get(`/api/fetch/repositorydata/`, {
        headers: {
          Authorization: `Bearer ${user.id}`,
        },
      })

        .then(response => {
          setRepositories(response.data);
          setRepositoriesLoading(false);
        })
        .catch(error => { 
          console.error('Error fetching repositories:', error);
          setRepositoriesLoading(false);
        });
    }
  }, [user]);

  const statsOverview = [
    {
      title: "Total Repositories",
      icon: <GitBranch className="w-5 h-5 text-[#0396FD]" />,
      value: repositories.length,
    },
    {
      title: "Needs Attention",
      icon: <AlertCircle className="w-5 h-5 text-red-500" />,
      value: repositories.filter((r) => r.status === "Needs Attention").length,
    },
    {
      title: "Updated",
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
      value: repositories.filter((r) => r.status === "Updated").length,
    },
    {
      title: "Starred Repositories",
      icon: <Star className="w-5 h-5 text-yellow-500" />,
      value: repositories.filter((repo) => repo.starred).length,
    },
  ];

  const handleGridView = (view: string) => {
    setGridView(view === "grid");
    console.log(view);
    localStorage.setItem("gridView", `${view === "grid"}`);
  }

  const handleStarClick = (repoName: string) => {
    console.log(`Star clicked for ${repoName}`);

    const updatedRepositories = repositories.map((repo) =>
      repo.name === repoName ? { ...repo, starred: !repo.starred } : repo
    );
    setRepositories(updatedRepositories);
  };

  return (
    <div className={`flex flex-col gap-4 px-10 py-5`}>
        <div className="gap-4">
            <h1 className="text-sm5 font-bold font-raleway-dots w-fit">
            {user ? (
                <>
                Welcome, {user.fullName || user.firstName || "User"}
                <hr className="border-[#3D444D] mt-2" />
                </>
            ) : null}
            </h1>
            <div className="flex items-center mt-5 justify-between">
                <h2 className="text-3xl font-bold text-white">Overview</h2>
                {user && 
                <>
                <div className="flex items-center gap-4">
                    <div className="flex items-center border border-[#383737] rounded-md">
                    <button className={`text-sm hover:text-white px-3 py-[9px] border-r border-[#383737] flex items-center gap-2 ${gridView ? "bg-[#1f1f1f] text-white" : "bg-transparent text-[#a0a0a3]"}`} onClick={() => handleGridView("grid")}>
                        <LuLayoutGrid size={16} />

                    </button>

                    <button className={`text-sm hover:text-white px-3 py-[9px] flex items-center gap-2 ${gridView ? "bg-transparent text-[#a0a0a3]" : "bg-[#1f1f1f] text-white"}`} onClick={() => handleGridView("list")}>
                        <LuList size={18} />
                    </button>


                    </div>

                    <a
                    href={`https://github.com/apps/gitdocs-ai/installations/new`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm bg-[#0791F9] hover:bg-[#3196e3] rounded-md px-4 py-2 flex items-center gap-2"
                    >

                    {repositoriesLoading 
                    ? <LoadingAnimation /> : 
                    <LuPlus size={16} />}
                    Add New Repository

                    </a>
                </div>
            </>
            }
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

          <div className={`w-full ${collapsed ? "grid-cols-3" : "grid-cols-2"} ${gridView ? "grid gap-4" : "flex flex-col gap-4"}`}>
            {repositories.length > 0 ? (
              gridView ? (
                repositories.map((repo, index) => (
                  <RepoCards key={index} repo={repo} handleStarClick={handleStarClick} />
                ))
              ) : (
                repositories.map((repo, index) => (
                  <RepoList key={index} repo={repo} handleStarClick={handleStarClick} />
                ))
              )
            ) : (
              <div className="flex items-center col-span-full justify-center h-full">
                <h3 className="font-bold">Added repositories will appear here</h3>
              </div>
            )}

          </div>
        </>

      ) : (
        <div className="flex items-center gap-4">
          <h3 className="font-bold">
            Please <span className="text-[#F8C75D]"><SignInButton /></span> to view your projects.
          </h3>
        </div>

      )}
    </div>
  );
};

export default HeroSection;
