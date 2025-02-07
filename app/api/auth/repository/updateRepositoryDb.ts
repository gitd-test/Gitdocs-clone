import connectMongo from "@/app/api/lib/db/connectMongo";
import Repository from "@/app/api/lib/models/Repository";
import User from "@/app/api/lib/models/User";

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


export const updateRepositoryDb = async (repositories: Repository[], userId: string) => {
    await connectMongo();

    try {        
        // Iterate through the repositories and update existing ones, or insert new ones
        for (const repo of repositories) {
            try {
                // Use upsert to update if exists or insert if it doesn't
                const result = await Repository.updateOne(
                    { repositoryId: repo.repositoryId },
                    { $set: repo },
                    { upsert: true } 
                );

                if (result.upsertedId) {
                    // If the repository was inserted, get the user and update their repositories array
                    await User.updateMany(
                        { clerkUid: userId }, 
                        { $addToSet: { repositories: repo.repositoryId } }
                    );
                    console.log(`Added repository ${repo.repositoryId} to users' repositories.`);
                }

            } catch (error) {
                if (error.code === 11000) {
                    console.error(`Repository with ID ${repo.repositoryId} already exists.`);
                } else {
                    throw error; // Rethrow other types of errors
                }
            }
        }

        // Delete repositories in the database that are no longer in the passed list
        const deletedRepoIds = await Repository.deleteMany({ repositoryId: { $nin: repositories.map(repo => repo.repositoryId) } });

        // If some repositories were deleted, also remove them from the user's repositories array
        if (deletedRepoIds.deletedCount > 0) {
            // Remove deleted repository IDs from the user's repositories array
            const deletedRepositoryIds = await Repository.find({ repositoryId: { $nin: repositories.map(repo => repo.repositoryId) } }).select('repositoryId');
            const deletedRepoIdsList = deletedRepositoryIds.map(repo => repo.repositoryId);

            await User.updateMany(
                { clerkUid: userId }, 
                { $pull: { repositories: { $in: deletedRepoIdsList } } }
            );
            console.log(`Removed deleted repositories from users' repositories.`);
        }

    } catch (error) {
        console.error('Error syncing repositories:', error);
        throw error; // You can handle the error in your desired way
    }
};