import UpdateReadmePage from "@/components/Update_Readme/UpdateReadmePage";
import { getRepositoryByNamePopulated } from "@/app/api/auth/repository/clientRepositoryServices";
import { auth } from "@clerk/nextjs/server";
import User from "@/app/api/lib/models/User";
import connectMongoWithRetry from "@/app/api/lib/db/connectMongo";


export type paramsType = Promise<{ doc_name: string }>;

const verifyUserWithDoc = async (userId: string, doc_name: string) => {
  await connectMongo();
  const user = await User.findOne({ clerkUid: userId });
  const doc = await getRepositoryByNamePopulated(doc_name);
  return user && doc && user.githubUid == doc.owner;

};

// Generate metadata for the page
export const generateMetadata = async (props: { params: paramsType }) => {
  const { userId } = await auth();
  if (!userId) {
    return {
      title: `Error: Unauthorized`,

      description: `Error: Unauthorized`,
    };
  }
  const { doc_name } = await props.params;
  const validDoc = await verifyUserWithDoc(userId, doc_name);

  if (!validDoc) {
    return {
      title: `Error: Repository ${doc_name} not found`,
      description: `Error: Repository ${doc_name} not found`,
    };
  }


  return {
    title: `Update Readme: ${doc_name} | Gitdocs AI`,
    description: `Update Readme for ${doc_name}`,
  };
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