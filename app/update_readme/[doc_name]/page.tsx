import UpdateReadmePage from "@/components/Update_Readme/UpdateReadmePage";

interface UpdateReadmeProps {
  params: {
    doc_name: string;
  };
}

export const generateMetadata = async ({ params }: UpdateReadmeProps) => {
  const { doc_name } = await params;

  return {
    title: `Update Readme: ${doc_name} | Gitdocs AI`,
    description: `Update Readme for ${doc_name}`,
  };
};

const UpdateReadme = async ({ params }: UpdateReadmeProps) => {
  const { doc_name } = await params;

  return <UpdateReadmePage doc_name={doc_name} />;
};

export default UpdateReadme;