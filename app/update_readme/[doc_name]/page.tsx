"use client"

import { useState, useEffect } from "react";
import UpdateReadmePage from "@/components/Update_Readme/UpdateReadmePage";

export default function UpdateReadme({ params }: { params: { doc_name: string } }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await fetch(`/api/verify?doc_name=${params.doc_name}`);
        if (!response.ok) {
          const { error } = await response.json();
          throw new Error(error || "Unauthorized or Repository not found");
        }
        setLoading(false);
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };
    verify();
  }, [params.doc_name]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <UpdateReadmePage doc_name={params.doc_name} />;
}
