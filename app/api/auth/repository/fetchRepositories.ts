import { getAuthenticatedOctokit } from "@/app/api/lib/githubOctokit";

export const fetchRepositoriesForInstallation = async (installationId: number) => {
  const octokit = getAuthenticatedOctokit(installationId);

  try {

    const { data } = await octokit.request("GET /installation/repositories", {});

    return data.repositories;
  } catch (error) {
    console.error("Error fetching repositories for installation:", error);
    throw new Error("Failed to fetch repositories");
  }
};

