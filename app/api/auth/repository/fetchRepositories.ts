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

// Define response type for clarity
interface ReadmeResponse {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: string;
  content: string;
  encoding: string;
  _links: {
    self: string;
    git: string;
    html: string;
  };
  decodedContent?: string;
}

/**
 * Fetches the README file for a GitHub repository with robust error handling
 * @param owner - GitHub username or organization name
 * @param repo - Repository name
 * @param installationId - GitHub App installation ID
 * @returns README data with decoded content or null if not found
 */
export const fetchRepositoryReadme = async (
  owner: string, 
  repo: string, 
  installationId: number
): Promise<(ReadmeResponse & { decodedContent: string }) | null> => {
  // Parameter validation
  if (!owner || typeof owner !== 'string') {
    throw new Error('Invalid owner parameter: must be a non-empty string');
  }
  
  if (!repo || typeof repo !== 'string') {
    throw new Error('Invalid repo parameter: must be a non-empty string');
  }
  
  if (!installationId || isNaN(Number(installationId))) {
    throw new Error('Invalid installationId parameter: must be a number');
  }

  // Get authenticated Octokit instance with retries
  let octokit;
  try {
    octokit = getAuthenticatedOctokit(installationId);
  } catch (error) {
    console.error(`Failed to authenticate GitHub API for installation ${installationId}:`, error);
    throw new Error('GitHub API authentication failed');
  }

  // Configure timeout and retry options
  const maxRetries = 3;
  const timeoutMs = 10000; // 10 seconds
  
  try {
    // Try to fetch README with timeout
    const fetchPromise = octokit.request("GET /repos/{owner}/{repo}/readme", {
      owner,
      repo,
      request: {
        timeout: timeoutMs
      }
    });

    // Add timeout control
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`README fetch timed out after ${timeoutMs}ms`)), timeoutMs);
    });

    // Use Promise.race to implement timeout
    const { data } = await Promise.race([fetchPromise, timeoutPromise]) as { data: ReadmeResponse };

    // Validate response data
    if (!data || typeof data !== 'object') {
      console.warn(`Invalid README response for ${owner}/${repo}`);
      return null;
    }

    // Handle different encodings
    if (data.encoding === "base64" && data.content) {
      try {
        const decodedContent = Buffer.from(data.content, "base64").toString("utf-8");
        return {
          ...data,
          decodedContent,
        };
      } catch (decodeError) {
        console.error(`Failed to decode base64 content for ${owner}/${repo}:`, decodeError);
        // Return original data without decoded content if decoding fails
        return {
          ...data,
          decodedContent: 'Error decoding content'
        };
      }
    } else if (data.encoding && data.encoding !== "base64") {
      console.warn(`Unsupported encoding ${data.encoding} for ${owner}/${repo} README`);
      // Try to handle non-base64 encoding if possible
      return {
        ...data,
        decodedContent: data.content || 'Content in unsupported encoding'
      };
    }

    // Handle case where encoding is missing or content is missing
    if (!data.content) {
      console.warn(`README for ${owner}/${repo} has no content`);
      return {
        ...data,
        decodedContent: ''
      };
    }

    return {
      ...data,
      decodedContent: data.content // Return content as-is if not base64
    };
  } catch (error: any) {
    // Handle specific error cases
    if (error.response) {
      const status = error.response.status;
      
      // Handle 404 errors specifically - README doesn't exist
      if (status === 404) {
        console.warn(`README not found for repository: ${owner}/${repo}`);
        return null;
      }
      
      // Handle rate limiting
      if (status === 403 && error.response.headers && error.response.headers['x-ratelimit-remaining'] === '0') {
        const resetTime = error.response.headers['x-ratelimit-reset'];
        const waitTime = resetTime ? new Date(Number(resetTime) * 1000).toISOString() : 'unknown time';
        console.warn(`GitHub API rate limit exceeded. Resets at ${waitTime}`);
        throw new Error(`GitHub API rate limit exceeded for ${owner}/${repo}`);
      }
      
      // Handle other HTTP errors
      console.error(`GitHub API error (${status}) for ${owner}/${repo}:`, error.response.data);
      throw new Error(`GitHub API returned ${status} error for ${owner}/${repo}`);
    }
    
    // Handle network errors
    if (error.request) {
      console.error(`Network error fetching README for ${owner}/${repo}:`, error.message);
      throw new Error(`Network error fetching README for ${owner}/${repo}: ${error.message}`);
    }
    
    // Handle timeout errors
    if (error.message && error.message.includes('timed out')) {
      console.error(`Timeout fetching README for ${owner}/${repo}`);
      throw new Error(`Timeout fetching README for ${owner}/${repo}`);
    }
    
    // Handle all other errors
    console.error(`Unknown error fetching repository README for ${owner}/${repo}:`, error);
    throw new Error(`Failed to fetch repository README for ${owner}/${repo}: ${error.message || 'Unknown error'}`);
  }
};