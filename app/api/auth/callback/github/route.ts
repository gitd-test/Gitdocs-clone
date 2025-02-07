import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { fetchRepositoriesForInstallation } from "../../repository/fetchRepositories";
import { parseRepositories, updateRepositoryDb } from "../../repository/updateRepositoryDb";
import { auth } from '@clerk/nextjs/server';
import { updateUserDb } from "../../user/updateUserDb";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  let installationId = url.searchParams.get("installation_id");
  // const state = url.searchParams.get("state");

  if (!code) {
    return NextResponse.json({ error: "No code received from GitHub" }, { status: 400 });
  }

  try {
    // Step 1: Exchange the code for an access token
    const response = await axios.post(
      "https://github.com/login/oauth/access_token",
      null,
      {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: process.env.GITHUB_REDIRECT_URI,
        },
        headers: {
          Accept: "application/json",
        },
      }
    );

    const { access_token } = response.data;

    // Step 2: Get the user's GitHub ID using the access token
    const { data: userData } = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const githubUserId = userData.id;  // This is the user's GitHub ID
    (async () => {
      if (userId) {
        await updateUserDb(userId, githubUserId);
      }
    })();

    if (!access_token) {
      return NextResponse.json({ error: "Failed to get access token" }, { status: 500 });
    }

    // Step 2: Validate or fetch `installationId` if not provided
    if (!installationId) {
      const { data: installations } = await axios.get(
        "https://api.github.com/user/installations",
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      if (!installations.total_count) {
        return NextResponse.json({ error: "No installations found for the user" }, { status: 404 });
      }

      installationId = installations.installations[0].id.toString();
    }

    // Step 3: Fetch repositories asynchronously
    (async () => {
      try {
        const repositories = await fetchRepositoriesForInstallation(Number(installationId));
        const parsedRepositories = await parseRepositories(repositories);
        await updateRepositoryDb(parsedRepositories, userId || "");
      } catch (error: any) {
        console.error("Error fetching repositories:", error.message);
      }

    })();

    // Step 4: Redirect the user
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/close`);
  } catch (error) {
    console.error("GitHub OAuth Error:", error);
    return NextResponse.json({ error: "Error during OAuth process" }, { status: 500 });
  }
}
