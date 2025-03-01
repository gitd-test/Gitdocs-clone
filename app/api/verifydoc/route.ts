import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import User from "@/app/api/lib/models/User";
import Repository from "@/app/api/lib/models/Repository";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 300 }); // Cache for 5 minutes

const verifyUserWithDoc = async (userId: string, doc_name: string) => {
  const cacheKey = `${userId}:${doc_name}`;
  const cachedResult = cache.get(cacheKey);
  if (cachedResult !== undefined) return cachedResult;

  const user = await User.findOne({ clerkUid: userId }, { githubUid: 1 });
  if (!user) return false;

  const repository = await Repository.findOne({ owner: user.githubUid, name: doc_name });
  const valid = !!repository;

  cache.set(cacheKey, valid);
  return valid;
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const doc_name = url.searchParams.get("doc_name");
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!doc_name) {
      return NextResponse.json({ error: "Invalid repository name" }, { status: 400 });
    }

    const validDoc = await verifyUserWithDoc(userId, doc_name);
    if (!validDoc) {
      return NextResponse.json({ error: `Repository ${doc_name} not found` }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
