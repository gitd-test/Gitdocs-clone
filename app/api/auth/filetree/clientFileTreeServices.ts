import { getAuthenticatedOctokit } from "@/app/api/lib/githubOctokit";
import User from "@/app/api/lib/models/User";

// Minimal type representing the repository content items
type RepoContentItem = {
  type: "file" | "dir" | "symlink" | "submodule";
  name: string;
};

type RepoContent = RepoContentItem | RepoContentItem[];

export async function getFileTree(userId: string, doc_name: string, path: string) {
  try {
  const user = await User.findOne(
    { clerkUid: userId },
    { installationId: 1, githubUsername: 1 }
  );

  if (!user || !user.installationId || !user.githubUsername) {
    return "Data not found";
  }
  const octokit = getAuthenticatedOctokit(Number(user.installationId));

  const response = await octokit.repos.getContent({
    owner: user.githubUsername,
    repo: doc_name,
    path,
  });

  // Cast response.data to our custom type
  const data = response.data as RepoContent;

  // If data is an array, filter and format it.
  if (Array.isArray(data)) {
    // Type guard to filter only 'file' and 'dir' items
    const filtered = data.filter(
      (item): item is { type: "file" | "dir"; name: string } =>
        item.type === "file" || item.type === "dir"
    );

    const initialTree = filtered.map((item) =>
      item.type === "dir" ? [item.name] : item.name
    );

    return initialTree;
  } else {
    // For a single item (non-array), format based on its type
    if (data.type === "dir") {
      const initialTree = [[data.name]];
      return initialTree;
    } else {
      const initialTree = [data.name];
      return initialTree;
    }
  }
  } catch (error) {
    console.error('Error fetching initial tree:', error);
    return ["Error fetching initial tree"];
  }
}
