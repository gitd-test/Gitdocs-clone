import UpdateReadmePage from "@/components/Update_Readme/UpdateReadmePage";

interface UpdateReadmeProps {
  params: {
    doc_name: string;
  };
}

export const generateMetadata = ({ params }: UpdateReadmeProps) => {
  return {
    title: `Update Readme: ${params.doc_name} | Gitdocs AI`,
    description: `Update Readme for ${params.doc_name}`,
  };
};

const UpdateReadme = ( {params} : UpdateReadmeProps ) => {
  return (
    <UpdateReadmePage doc_name={params.doc_name} />
  )
}

export default UpdateReadme;