import UpdateReadmePage from "@/components/Update_Readme/UpdateReadmePage";
import { auth } from "@clerk/nextjs/server";
import User from "@/app/api/lib/models/User";
import Repository from "@/app/api/lib/models/Repository";
import NodeCache from "node-cache";

export type paramsType = Promise<{ doc_name: string }>;

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


// Main component for the page
export default async function UpdateReadme(props: { params: paramsType }) {
  const { doc_name } = await props.params;

  const { userId } = await auth();
  if (!userId) {
    return <div>Error: Unauthorized</div>;
  }

  const validDoc = await verifyUserWithDoc(userId, doc_name);


  if (!validDoc) {
    return <div>Error: Repository ${doc_name} not found</div>;
  }


  return <UpdateReadmePage doc_name={doc_name} />;

};