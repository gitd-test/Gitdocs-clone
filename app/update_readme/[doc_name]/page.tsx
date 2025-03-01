import UpdateReadmePage from "@/components/Update_Readme/UpdateReadmePage";
import { auth } from "@clerk/nextjs/server";
import User from "@/app/api/lib/models/User";

export type paramsType = Promise<{ doc_name: string }>;

const verifyUserWithDoc = async (userId: string, doc_name: string) => {
  const doc = await User.aggregate([
    { $match: { clerkUid: userId } },
    {
      $lookup: {
        from: "repositories",
        localField: "githubUid",
        foreignField: "owner",
        as: "repository",
      },
    },
    { $match: { "repository.name": doc_name } },
  ]);
  return doc.length > 0;
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