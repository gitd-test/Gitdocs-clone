"use client";

import { useUser } from "@clerk/nextjs";
import { AppContext } from "@/contexts/AppContext";
import { useContext, useEffect, useState, Dispatch, SetStateAction } from "react";
import { LuPlus, LuLayoutGrid, LuList } from "react-icons/lu";
import RepoCards from "../common/RepoCards";
import LoadingAnimation from "../common/LoadingAnimation";
import { SignInButton } from "@clerk/nextjs";
import axios from "axios";
import RepoList from "../common/RepoList";
import { PiWarning } from "react-icons/pi";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

interface Repository {
  name: string;
  gitLink: string;
  lastUpdated: string;
  status: string;
  recentCommitDescription: string;
  starred: boolean;
  suggestions?: number;
  visibility?: string;
  score?: number;
}

interface AppContextType {
  collapsed: boolean;
  gridView: boolean;
  setGridView: Dispatch<SetStateAction<boolean>>;
  repositoriesUpdated: boolean;
  setRepositoriesUpdated: Dispatch<SetStateAction<boolean>>;
}


const HeroSection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const { collapsed, gridView, setGridView, repositoriesUpdated, setRepositoriesUpdated } = useContext(AppContext) as AppContextType;
  const [repositoriesLoading, setRepositoriesLoading] = useState(false);
  const [repositories, setRepositories] = useState<Repository[]>([]);

  useEffect(() => {
    if (user) {
      setRepositoriesLoading(true);
      const storedRepositories = localStorage.getItem("repositories");
      if (storedRepositories && !searchParams.get("refresh")) {
        setRepositories(JSON.parse(storedRepositories));
        setRepositoriesLoading(false);

      } else {
        axios
          .get(`/api/fetch/repositorydata`, {
            headers: {
              Authorization: `Bearer ${user.id}`,
            },
          })

        .then((response) => {
          setRepositories(response.data);
          localStorage.setItem("repositories", JSON.stringify(response.data));
          setRepositoriesLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching repositories:", error);
          setRepositoriesLoading(false);
        });
      }
    }
  }, [user, searchParams, repositoriesUpdated]);

  const handleAddRepository = () => {
    setRepositoriesUpdated(true);
  };


  const handleGridView = (view: string) => {
    setGridView(view === "grid");
    console.log(view);
    localStorage.setItem("gridView", `${view === "grid"}`);
  };


  const handleStarClick = (repoName: string) => {
    console.log(`Star clicked for ${repoName}`);
    const updatedRepositories = repositories.map((repo) =>
      repo.name === repoName ? { ...repo, starred: !repo.starred } : repo
    );
    setRepositories(updatedRepositories);
  };

  const handleRefresh = () => {
    setRepositoriesUpdated(false);
    router.push("/?refresh=true");
    router.refresh();
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
          {user && (
            <>
              <h2 className="text-3xl font-bold text-white">Overview</h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-[#383737] rounded-md">
                  <button
                    className={`text-sm hover:text-white px-3 py-[9px] border-r border-[#383737] flex items-center gap-2 ${
                      gridView ? "bg-[#1f1f1f] text-white" : "bg-transparent text-[#a0a0a3]"
                    }`}
                    onClick={() => handleGridView("grid")}
                  >
                    <LuLayoutGrid size={16} />
                  </button>
                  <button
                    className={`text-sm hover:text-white px-3 py-[9px] flex items-center gap-2 ${
                      gridView ? "bg-transparent text-[#a0a0a3]" : "bg-[#1f1f1f] text-white"
                    }`}
                    onClick={() => handleGridView("list")}
                  >
                    <LuList size={18} />
                  </button>
                </div>
                <a
                  href={`https://github.com/apps/gitdocs-ai/installations/new`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm bg-[#0791F9] hover:bg-[#3196e3] rounded-md px-4 py-2 flex items-center gap-2"
                  onClick={() => handleAddRepository()}
                >
                  {repositoriesLoading ? <LoadingAnimation /> : <LuPlus size={16} />}
                  Add New Repository
                </a>
              </div>
            </>
          )}
        </div>
      </div>
      {user ? (
        <>
          {repositoriesUpdated && (
            <div className="flex items-center justify-between border py-2 px-3 rounded-lg border-[#DF7189] gap-4 h-full w-full">
              <div className="flex items-center gap-2 text-[#DF7189]">
                <PiWarning size={18} />
                <h3 className="text-sm text-[#DF7189]">Repositories updated, click to refresh</h3>
              </div>
              <button className="text-sm rounded-md p-1 flex items-center gap-2 text-[#0D8EF3] hover:underline" onClick={() => handleRefresh()}>
                Refresh
              </button>
            </div>

          )}

          <div
            className={`w-full mt-5 ${
              collapsed ? "grid-cols-3" : "grid-cols-2"
            } ${gridView ? "grid gap-4" : "flex flex-col gap-4"}`}

          >
            {repositories.length > 0 ? (
              gridView ? (
                repositories.map((repo, index) => (
                  <RepoCards
                    key={index}
                    repo={{
                      ...repo,
                      suggestions: repo.suggestions || 0,
                      visibility: repo.visibility || "public",
                      score: repo.score || 0,
                    }}
                    handleStarClick={handleStarClick}
                  />
                ))
              ) : (
                repositories.map((repo, index) => (
                  <RepoList
                    key={index}
                    repo={{
                      ...repo,
                      suggestions: repo.suggestions || 0,
                      visibility: repo.visibility || "public",
                      score: repo.score || 0,
                    }}
                    handleStarClick={handleStarClick}
                  />
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
        <div className="flex items-center gap-4 h-full w-full">
          <h3 className="font-bold">
            Please <span className="text-[#F8C75D]"><SignInButton /></span> to view your projects.
          </h3>
        </div>
      )}

    </div>
  );
};

export default HeroSection;
