import { isValidObjectId } from "mongoose";
import Repository from "@/app/api/lib/models/Repository";
import User from "@/app/api/lib/models/User";
import { RepositoryType, RepositoryUserType } from "@/app/api/lib/models/AllModelSchemas";

// Type guard for RepositoryType
const isRepositoryType = (obj: any): obj is RepositoryType => {
    return (
        typeof obj.name === "string" &&
        typeof obj.repositoryId === "string" &&
        typeof obj.gitLink === "string" &&
        typeof obj.owner === "string" &&
        typeof obj.visibility === "string" &&
        typeof obj.starred === "boolean"
    );
};

// Function to get client repositories
export const getClientRepositories = async (userId: string): Promise<RepositoryType[]> => {
    try {
        // Fetch user with a lean query and cast to UserType
        const user = await User.findOne({ clerkUid: userId }).lean<RepositoryUserType>().exec();

        // Check if the user exists and has a githubUid
        if (!user || !user.githubUid) {
            return []; // Return an empty list if no githubUid is found
        }

        // Fetch repositories owned by the user
        const repositories = await Repository.find({ owner: user.githubUid }).lean<Partial<RepositoryType>[]>().exec();

        // Filter using the type guard
        return repositories.filter(isRepositoryType);
    } catch (error) {
        console.error("Error fetching client repositories:", error);
        throw new Error("Failed to fetch repositories.");
    }
};

// Function to get repository by ID
export const getRepositoryById = async (repositoryId: string): Promise<RepositoryType | null> => {
    try {
        // Validate repositoryId
        if (!isValidObjectId(repositoryId)) {
            throw new Error("Invalid repository ID.");
        }

        // Fetch repository by ID
        const repository = await Repository.findById(repositoryId).lean<Partial<RepositoryType>>().exec();

        // Validate the object with the type guard
        return repository && isRepositoryType(repository) ? repository : null;
    } catch (error) {
        console.error("Error fetching repository by ID:", error);
        throw new Error("Failed to fetch repository by ID.");
    }
};

// Function to get repository by name
export const getRepositoryByNamePopulated = async (name: string): Promise<RepositoryType | null> => {
    try {
        // Fetch repository by name
        const repository = await Repository.findOne({ name }).lean<Partial<RepositoryType>>().exec();

        console.log(name);
        console.log(repository);
        // Validate the object with the type guard
        return repository && isRepositoryType(repository) ? repository : null;
    } catch (error) {
        console.error("Error fetching repository by name:", error);
        throw new Error("Failed to fetch repository by name.");
    }
};

// Function to get repositories by owner
export const getRepositoryByOwner = async (owner: string): Promise<RepositoryType[]> => {
    try {
        // Fetch repositories by owner
        const repositories = await Repository.find({ owner }).lean<Partial<RepositoryType>[]>().exec();

        // Filter using the type guard
        return repositories.filter(isRepositoryType);
    } catch (error) {
        console.error("Error fetching repositories by owner:", error);
        throw new Error("Failed to fetch repositories by owner.");
    }
};

// Function to get repository by owner and repositoryId
export const getRepositoryByOwnerAndRepositoryId = async (
    owner: string,
    repositoryId: string
): Promise<RepositoryType | null> => {
    try {
        // Validate repositoryId
        if (!isValidObjectId(repositoryId)) {
            throw new Error("Invalid repository ID.");
        }

        // Fetch repository by owner and repositoryId
        const repository = await Repository.findOne({ owner, repositoryId }).lean<Partial<RepositoryType>>().exec();

        // Validate the object with the type guard
        return repository && isRepositoryType(repository) ? repository : null;
    } catch (error) {
        console.error("Error fetching repository by owner and repository ID:", error);
        throw new Error("Failed to fetch repository by owner and repository ID.");
    }
};
