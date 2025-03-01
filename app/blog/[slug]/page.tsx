import UpdateReadmePage from "@/components/Update_Readme/UpdateReadmePage";
import { auth } from "@clerk/nextjs/server";
import NotFound from "@/app/not-found";

export type ParamsType = Promise<{ doc_name: string }>;

// Helper function to call the API
const verifyDocWithAPI = async (userId: string, doc_name: string) => {
  try {
    const response = await fetch(`/api/verifydoc`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, doc_name }),
    });

    if (!response.ok) {
      return false;
    }

    const { valid } = await response.json();
    return valid;
  } catch (error) {
    console.error("Error verifying document:", error);
    return false;
  }
};

// Main component for the page
const UpdateReadme = async ({ params }: { params: ParamsType }) => {
  const { doc_name } = await params; // Await params here

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
