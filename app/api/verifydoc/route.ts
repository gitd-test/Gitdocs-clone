import { NextApiRequest, NextApiResponse } from "next";
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId } = await auth();
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { doc_name } = req.query;
  if (!doc_name || typeof doc_name !== "string") {
    return res.status(400).json({ error: "Invalid repository name" });
  }

  try {
    const validDoc = await verifyUserWithDoc(userId, doc_name);
    if (!validDoc) {
      return res.status(404).json({ error: `Repository ${doc_name} not found` });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
}
