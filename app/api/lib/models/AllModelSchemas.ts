import { Document } from "mongoose";

export interface UserType extends Document {
    clerkUid: string;                    // Unique identifier from Clerk
    githubUid?: string;                  // Optional GitHub UID
    firstName?: string;                  // Optional first name
    lastName?: string;                   // Optional last name
    email: string;                       // User email
    subscriptionType: "Free" | "Pro" | "Enterprise"; // Subscription type with enum values
    signupDate: Date;                    // The date when the user signed up
    lastLogin: Date | null;              // Last login date, nullable
    repositories: string[];              // Array of repository IDs
    stepsCompleted: number;              // Tracks completed steps
    createdAt?: Date;                    // Auto-generated timestamp
    updatedAt?: Date;                    // Auto-generated timestamp
}

export interface RepositoryType extends Document {
    name: string;
    repositoryId: string;
    description?: string;
    gitLink: string;
    owner: string;
    readme?: string;
    lastUpdated?: Date;
    status?: string;
    recentCommitDescription?: string;
    suggestions?: number;
    visibility: string;
    starred: boolean;
    score?: number;
}