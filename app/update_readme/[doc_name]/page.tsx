import UpdateReadmePage from "@/components/Update_Readme/UpdateReadmePage";

export type paramsType = Promise<{ doc_name: string }>;

// Generate metadata for the page

export const generateMetadata = async (props: { params: paramsType }) => {
  const { doc_name } = await props.params;

  return {
    title: `Update Readme: ${doc_name} | Gitdocs AI`,
    description: `Update Readme for ${doc_name}`,
  };
};

// Main component for the page
export default async function UpdateReadme(props: { params: paramsType }) {
  const { doc_name } = await props.params;

  return <UpdateReadmePage doc_name={doc_name} />;
};