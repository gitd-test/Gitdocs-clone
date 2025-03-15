import Repository from "@/app/api/lib/models/Repository";
import User from "@/app/api/lib/models/User";
import { fetchRepositoryReadme } from "./fetchRepositories";
import { updateReadmeDb } from "./updateReadmeDb";
import Readme from "../../lib/models/Readme";
import mongoose from "mongoose";

interface Repository {
    name: string;
    repositoryId: string;
    description: string;
    gitLink: string;
    owner: string;
    readme: string;
    lastUpdated: string;
    status: string;
    recentCommitDescription: string;
    suggestions: number;
    visibility: string;
    starred: boolean;
}

export const parseRepositories = async (repositories: any) => {
    const parsedRepositories = repositories.map((repository: any) => {
        return {
            name: repository.name,
            repositoryId: repository.id,
            description: repository.description || "No description provided",
            gitLink: repository.html_url,
            owner: repository.owner.id,
            readme: "",
            lastUpdated: repository.updated_at,
            status: repository.status,
            recentCommitDescription: "",
            suggestions: 0,
            visibility: repository.visibility,
            starred: false,
        };
    });
    return parsedRepositories;
};

export const updateRepositoryDb = async (
    repositories: Repository[], 
    userId: string, 
    installationId: number, 
    githubUsername: string, 
    githubUserId: string
  ): Promise<void> => {
    // Parameter validation
    if (!repositories || !Array.isArray(repositories)) {
      throw new Error('Invalid repositories parameter: must be an array');
    }
    
    if (!githubUserId) {
      throw new Error('GitHub user ID is required');
    }
  
    const session = await mongoose.startSession();
    let successCount = 0;
    const failedRepos: string[] = [];
    
    try {
      // Begin transaction
      await session.withTransaction(async () => {
        // Data validation - filter out invalid repositories
        const validRepositories = repositories.filter(repo => 
          repo && typeof repo === 'object' && 
          repo.repositoryId && typeof repo.repositoryId === 'string' &&
          repo.name && typeof repo.name === 'string'
        );
        
        if (validRepositories.length === 0) {
          console.warn('No valid repositories to update');
          return;
        }
        
        // Save valid repository IDs for later use
        const validRepositoryIds = validRepositories.map(repo => repo.repositoryId);
        
        // Process repositories in batches to prevent overwhelming the database
        const BATCH_SIZE = 6;
        for (let i = 0; i < validRepositories.length; i += BATCH_SIZE) {
          const batch = validRepositories.slice(i, i + BATCH_SIZE);
          
          // Process each repository in the batch
          await Promise.allSettled(batch.map(async (repo) => {
            try {
              // Use upsert to update if exists or insert if it doesn't
              const result = await executeWithRetries(() => 
                Repository.updateOne(
                  { repositoryId: repo.repositoryId },
                  { 
                    $set: {
                      ...repo,
                      lastUpdated: new Date(),
                      owner: githubUserId
                    }
                  },
                  { upsert: true, session }
                )
              );
  
              // If the repository was inserted (new), update the user's repositories array
              if (result.upsertedCount > 0) {
                if (userId) {
                  await executeWithRetries(() => 
                    User.updateMany(
                      { clerkUid: userId }, 
                      { $addToSet: { repositories: repo.repositoryId } },
                      { session }
                    )
                  );
                }
  
                // Fetch README asynchronously (don't wait for it)
                if (githubUsername && repo.name) {
                  fetchReadmeAsync(githubUsername, repo.name, installationId, githubUserId, repo.repositoryId);
                }
              }
              
              successCount++;
            } catch (error) {
              failedRepos.push(repo.name || repo.repositoryId);
              
              if (isMongoError(error) && error.code === 11000) {
                console.warn(`Repository with ID ${repo.repositoryId} already exists but couldn't be updated.`);
              } else {
                console.error(`Failed to process repository ${repo.name || repo.repositoryId}:`, error);
              }
              // Continue processing other repositories
            }
          }));
        }
  
        // Only perform cleanup if we have successfully processed repositories
        if (successCount > 0 && githubUserId) {
          try {
            // Delete repositories that are no longer in the passed list
            await executeWithRetries(() => 
              Repository.deleteMany(
                { owner: githubUserId, repositoryId: { $nin: validRepositoryIds } },
                { session }
              )
            );
            
            await executeWithRetries(() => 
              Readme.deleteMany(
                { owner: githubUserId, repositoryId: { $nin: validRepositoryIds } },
                { session }
              )
            );
  
            // Update user's repositories array if userId exists
            if (userId && validRepositoryIds.length > 0) {
              await executeWithRetries(() => 
                User.updateMany(
                  { clerkUid: userId }, 
                  { $pull: { repositories: { $nin: validRepositoryIds } } },
                  { session }
                )
              );
            }
          } catch (error) {
            console.error('Error during cleanup operations:', error);
            // We don't rethrow here to avoid rolling back the successful repository updates
          }
        }
      });
  
      console.log(`Successfully processed ${successCount}/${repositories.length} repositories`);
      if (failedRepos.length > 0) {
        console.warn(`Failed to process ${failedRepos.length} repositories:`, failedRepos);
      }
    } catch (error) {
      console.error('Error during repository sync transaction:', error);
      throw new Error(`Repository sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      session.endSession();
    }
};

// Helper function to check if an error is a MongoDB error
const isMongoError = (error: any): error is mongoose.Error & { code?: number } => {
    return error instanceof mongoose.Error || (error && typeof error === 'object' && 'code' in error);
  };

  // Helper to execute with retries
const executeWithRetries = async <T>(
    operation: () => Promise<T>,
    maxRetries = 3,
    delay = 1000
  ): Promise<T> => {
    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        // Don't retry on duplicate key errors
        if (isMongoError(error) && error.code === 11000) {
          throw error;
        }
        
        if (attempt < maxRetries) {
          console.warn(`Operation failed, retrying (${attempt + 1}/${maxRetries})...`);
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
        }
      }
    }
    
    throw lastError;
  };

  // Separate async function to fetch README without blocking the main flow
const fetchReadmeAsync = async (
    githubUsername: string,
    repoName: string,
    installationId: number,
    githubUserId: string,
    repositoryId: string
  ): Promise<void> => {
    try {
      const readmeData = await fetchRepositoryReadme(githubUsername, repoName, installationId);
      
      if (readmeData) {
        await updateReadmeDb(githubUserId, repositoryId, readmeData);
      } else {
        console.warn(`No README found for repository: ${repoName}`);
      }
    } catch (error) {
      console.error(`Error fetching README for ${repoName}:`, error);
      // Error here doesn't affect the main repository sync flow
    }
  };
