import { NextRequest, NextResponse } from "next/server";
import { optimizeAI } from "@/app/api/lib/ai/optimizeAI";
import { getRepositoryByNamePopulated } from "@/app/api/auth/repository/clientRepositoryServices";
import { fetchReadmeDb } from "@/app/api/auth/repository/updateReadmeDb";
import { parseReadmeAnalysisResponse, printParsedResults } from "@/app/api/lib/optimizeResponseParser";

const systemPrompt = `
You are an expert assistant tasked with analyzing repository file structures to prepare for README generation. When presented with a list of files from a repository, you will provide a structured response following these exact formats:

1. SELECT RELEVANT FILES FOR README CREATION
   <file_selection>
   [
     {
       "file_path": "exact/path/to/file.ext",
       "importance": "HIGH|MEDIUM|LOW",
       "reason": "Brief explanation of why this file is valuable for README creation"
     },
     {...}
   ]
   </file_selection>

2. DETERMINE README TYPE
   <readme_type>
   {
     "primary_type": "PROJECT|API|PERSONAL|APPLICATION|CONFIGURATION|OTHER",
     "subtype": "More specific classification if applicable",
     "use_existing_readme": true|false,
     "reasoning": "Explanation for this classification and recommendation"
   }
   </readme_type>

3. GENERATE SPECIALIZED PROMPTS
   <new_readme_prompt>
   Complete, ready-to-use prompt for generating a new README from scratch
   </new_readme_prompt>

   <enhancement_prompt>
   Complete, ready-to-use prompt for enhancing an existing README
   </enhancement_prompt>

   <specialized_prompt>
   {
     "prompt_type": "Name of specialized prompt type",
     "prompt_content": "Complete, ready-to-use specialized prompt based on repo type"
   }
   </specialized_prompt>

Return the response as a properly formatted JSON array without newlines or escape characters within any tags.
Analyze the file list thoroughly before responding, focusing on understanding the project's purpose, structure, and documentation needs. Always maintain the exact XML tag structure shown above. Never omit any sections or tags. If information is unavailable for a section, include empty brackets [] or {} instead of removing the section.
`

export async function POST(request: NextRequest) {
    
    const { userId, prompt, doc_name } = await request.json();
    
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized"}, { status : 401 })
    }
    

    const repository = await getRepositoryByNamePopulated(doc_name);
    
    if (!repository) {
      return new Response(JSON.stringify({ error: "Repository not found" }), { status: 404 });
    }
    
    const repositoryId = repository.repositoryId;
    const readme = await fetchReadmeDb(repositoryId);

    if (!userId || !prompt) {
        return NextResponse.json({ error: "Missing userId or prompt" }, { status: 400 });
    }

    const response = await optimizeAI(userId, prompt, systemPrompt, readme);

    const parsedResponse = parseReadmeAnalysisResponse(response as string);

    console.log(parsedResponse);

    return NextResponse.json({
        file_selection: parsedResponse.file_selection,
        readme_type: parsedResponse.readme_type,
        new_readme_prompt: parsedResponse.new_readme_prompt,
        enhancement_prompt: parsedResponse.enhancement_prompt,
        specialized_prompt: parsedResponse.specialized_prompt
    });
}
