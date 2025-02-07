import UpdateReadmePage from "@/components/Update_Readme/UpdateReadmePage";

// Generate metadata for the page
export const generateMetadata = async ({ params }: { params: { doc_name: string } }) => {
  const { doc_name } = params;

  return {
    title: `Update Readme: ${doc_name} | Gitdocs AI`,
    description: `Update Readme for ${doc_name}`,
  };
};

// Main component for the page
const UpdateReadme = async ({ params }: { params: { doc_name: string } }) => {
  const { doc_name } = params;

  return <UpdateReadmePage doc_name={doc_name} />;
};

export default UpdateReadme;
