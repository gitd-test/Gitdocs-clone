import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosError } from "axios";
import { fetchRepositoriesForInstallation } from "../../repository/fetchRepositories";
import { parseRepositories, updateRepositoryDb } from "../../repository/updateRepositoryDb";
import { auth } from "@clerk/nextjs/server";
import { updateUserDb } from "../../user/updateUserDb";

export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const { userId } = await auth();
    
    // Parse URL parameters with validation
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    let installationId = url.searchParams.get("installation_id");

    // Validate code parameter
    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Invalid or missing code parameter" }, { status: 400 });
    }

    // Environment variable validation
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    const redirectUri = process.env.GITHUB_REDIRECT_URI;
    const nextAuthUrl = process.env.NEXTAUTH_URL || "https://gitdocs.space";

    if (!clientId || !clientSecret) {
      console.error("Missing GitHub OAuth credentials");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // Step 1: Exchange the code for an access token with timeout and retry logic
    let accessToken;
    let retries = 2;
    let tokenResponse;

    while (retries >= 0) {
      try {
        tokenResponse = await axios.post(
          "https://github.com/login/oauth/access_token",
          null,
          {
            params: {
              client_id: clientId,
              client_secret: clientSecret,
              code,
              redirect_uri: redirectUri || "",
            },
            headers: { Accept: "application/json" },
            timeout: 5000, // 5 second timeout
          }
        );
        break;
      } catch (error) {
        if (retries === 0) throw error;
        retries--;
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
      }
    }

    // Validate token response
    if (!tokenResponse?.data?.access_token) {
      console.error("Token response error:", tokenResponse?.data);
      throw new Error("Failed to get access token from GitHub");
    }

    const { access_token } = tokenResponse.data;

    // Step 2: Get the user's GitHub data with error handling
    let userData;
    try {
      const userResponse = await axios.get("https://api.github.com/user", {
        headers: { 
          Authorization: `Bearer ${access_token}`,
          "User-Agent": "GitDocs-App"
        },
        timeout: 5000
      });
      userData = userResponse.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("GitHub user data fetch error:", axiosError.response?.data || axiosError.message);
      throw new Error("Failed to retrieve GitHub user data");
    }

    if (!userData?.id || !userData?.login) {
      throw new Error("Invalid user data received from GitHub");
    }

    const githubUserId = userData.id;
    const githubUsername = userData.login;

    // Step 3: Validate or fetch installation ID
    if (!installationId) {
      try {
        const { data: installations } = await axios.get(
          "https://api.github.com/user/installations",
          {
            headers: { 
              Authorization: `Bearer ${access_token}`,
              "User-Agent": "GitDocs-App" 
            },
            timeout: 5000
          }
        );

        if (!installations?.installations?.length) {
          return NextResponse.redirect(`${nextAuthUrl}/error?message=${encodeURIComponent("No GitHub App installations found. Please install the app first.")}`);
        }

        installationId = installations.installations[0].id.toString();
      } catch (error) {
        const axiosError = error as AxiosError;
        console.error("GitHub installations fetch error:", axiosError.response?.data || axiosError.message);
        throw new Error("Failed to retrieve GitHub installations");
      }
    }

    // Validate installation ID
    if (!installationId || isNaN(Number(installationId))) {
      throw new Error("Invalid installation ID");
    }

    // Step 4: Update user database with proper error handling
    if (userId) {
      try {
        await updateUserDb(userId, githubUserId, installationId, githubUsername);
      } catch (error) {
        console.error("Failed to update user database:", error);
        // Continue execution despite this error - non-blocking
      }
    }

    // Step 5: Fetch and process repositories with dedicated error handling
    try {
      const repositories = await fetchRepositoriesForInstallation(Number(installationId));
      
      if (repositories && Array.isArray(repositories)) {
        const parsedRepositories = await parseRepositories(repositories);
        await updateRepositoryDb(
          parsedRepositories, 
          userId || "", 
          Number(installationId), 
          githubUsername, 
          githubUserId
        );
      } else {
        console.warn("No repositories returned or invalid format from API");
      }
    } catch (error: any) {
      // Log error but continue - repositories can be fetched later
      console.error("Error processing repositories:", error.message || error);
    }

    // Step 6: Successful redirect
    return NextResponse.redirect(`${nextAuthUrl}/close`);
    
  } catch (error: any) {
    // Comprehensive error handling
    console.error("GitHub OAuth Error:", error.message || error);
    
    // Determine appropriate status code based on error
    let statusCode = 500;
    let errorMessage = "Internal server error during OAuth process";
    
    if (error.message?.includes("code") || error.message?.includes("parameter")) {
      statusCode = 400;
      errorMessage = "Invalid request parameters";
    } else if (error.message?.includes("token")) {
      statusCode = 401;
      errorMessage = "Authentication failed with GitHub";
    }

    // Determine if we should redirect or return JSON based on the error
    const nextAuthUrl = process.env.NEXTAUTH_URL || "https://gitdocs.space";
    
    if (statusCode >= 500) {
      // For server errors, redirect to error page
      return NextResponse.redirect(
        `${nextAuthUrl}/error?message=${encodeURIComponent("GitHub authentication failed. Please try again later.")}`
      );
    } else {
      // For client errors, return JSON
      return NextResponse.json(
        {
          error: errorMessage,
          details: error.message || "Unknown error",
        },
        { status: statusCode }
      );
    }
  }
}