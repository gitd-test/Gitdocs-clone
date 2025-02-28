import Repository from "@/app/api/lib/models/Repository";
import User from "@/app/api/lib/models/User";

export const getClientRepositories = async (userId: string) => {

    const user = await User.findOne({ clerkUid: userId });

    // Check if the user exists and has a githubUid
    if (!user || !user.githubUid) {
      return [];  // Return an empty list if no githubUid is found
    }

    const githubUid = user.githubUid;

    const repositories = await Repository.find({ owner: githubUid });
    return repositories;

};

export const getRepositoryById = async (repositoryId: string) => {
    const repository = await Repository.findById(repositoryId);
    return repository;
};

export const getRepositoryByNamePopulated = async (name: string) => {
    const repository = await Repository.findOne({ name: name });
    return repository;
};


export const getRepositoryByOwner = async (owner: string) => {
    const repository = await Repository.find({ owner: owner });
    return repository;
};

export const getRepositoryByOwnerAndRepositoryId = async (owner: string, repositoryId: string) => {
    const repository = await Repository.findOne({ owner: owner, repositoryId: repositoryId });
    return repository;
};
