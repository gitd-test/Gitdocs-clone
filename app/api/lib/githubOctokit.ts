import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";

export const getAuthenticatedOctokit = (installationId: number) => {
  const octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId: process.env.GITHUB_APP_ID || "",
      privateKey: process.env.GITHUB_PRIVATE_KEY || "",
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      installationId: installationId,
    },
  });

  return octokit;
};
