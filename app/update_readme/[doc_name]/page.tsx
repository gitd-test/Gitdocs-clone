import UpdateReadmePage from "@/components/Update_Readme/UpdateReadmePage";
import { auth } from "@clerk/nextjs/server";
import NotFound from "@/app/not-found";
import axios from "axios";

// Helper function to call the API
const verifyDocWithAPI = async (userId: string, doc_name: string) => {
  try {
    const response = await axios.post(`https://gitdocs.space/api/verifydoc`, {
      userId,
      doc_name,
    });

    if (response.status !== 200) {
      return false;
    }

    const { data } = response.data;

    return data;
  } catch (error) {
    console.error("Error verifying document:", error);
    return false;
  }
};

// Main component for the page
const UpdateReadme = async ({ params }: { params: Promise<{ doc_name: string }> }) => {
  const { doc_name } = await params;

  const { userId } = await auth();
  if (!userId) {
    return <div>Error: Unauthorized</div>;
  }

  const validDoc = await verifyDocWithAPI(userId, doc_name);

  if (!validDoc) {
    return <NotFound />;
  }

  return <UpdateReadmePage doc_name={doc_name} />;
};

export default UpdateReadme;

// Generate metadata for the page
export const generateMetadata = async ({ params }: { params: Promise<{ doc_name: string }> }) => {
  const { doc_name } = await params;

  return {
    title: `Update Readme: ${doc_name} | GitDocs AI`,
    description: `Update the Readme file for ${doc_name}`,
  };
};
