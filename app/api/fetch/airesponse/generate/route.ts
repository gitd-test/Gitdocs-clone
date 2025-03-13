import { connectAI } from "@/app/api/lib/ai/connectAI";
import { NextRequest } from "next/server";
import { getRepositoryByNamePopulated } from "@/app/api/auth/repository/clientRepositoryServices";
import { fetchReadmeDb } from "../../../auth/repository/updateReadmeDb";
import connectMongoWithRetry from "@/app/api/lib/db/connectMongo";

// Streaming helper function
async function* streamResponse(stream: AsyncIterable<any>) {
  for await (const part of stream) {
    const rawContent = part.choices[0]?.delta?.content || "";
    // Check if the chunk contains either marker
    if (rawContent.includes("Readme:") || rawContent.includes("Conclusion:")) {
      // Split on the markers, keeping the markers in the resulting array
      const parts = rawContent.split(/(Readme:|Conclusion:)/);
      for (let segment of parts) {
        if (segment === "Readme:") {
          yield "<<readme>>\n";
        } else if (segment === "Conclusion:") {
          yield "<<conclusion>>\n";
        } else if (segment.trim() !== "") {
          yield segment;
        }
      }
    } else {
      yield rawContent;
    }
  }
  yield "<<end>>";
}


export async function POST(request: NextRequest) {
  const userId = request.headers.get("Authorization")?.split(" ")[1];

  if (!userId) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  await connectMongoWithRetry();

  const { prompt, doc_name, model } = await request.json();

  if (!prompt || !doc_name || !model) {
    return new Response(JSON.stringify({ error: "Prompt, doc_name, and model are required" }), { status: 400 });
  }

  const repository = await getRepositoryByNamePopulated(doc_name);
  
  if (!repository) {
    return new Response(JSON.stringify({ error: "Repository not found" }), { status: 404 });
  }

  const repositoryId = repository.repositoryId;
  const readme = await fetchReadmeDb(repositoryId);

  const updatedPrompt = {
    systemPrompt: `
    Do not respond in JSON format, just respond in this block format (formatting is important).
    
    You are an expert README generator that creates comprehensive, visually appealing documentation with proper markdown formatting.
    
    ## Goals
    - Create professional README files with consistent structure
    - Include visual elements like badges, diagrams, and charts where appropriate
    - Ensure all critical project information is documented
    - Make documentation visually scannable and easy to navigate
    - Brief explanation of any charts, diagrams, or badges included and how they enhance the documentation.
    
    This is the format you MUST follow in ALL responses:
    
    Detailed answer to the user's request with explanations of what was included in the README and why.
    
    Readme:
    \`\`\`markdown
    <!-- Complete README.md content with proper markdown syntax -->
    <!-- Include relevant badges, flowcharts, etc. -->
    <!-- Use blockquote (>) for sections where user needs to fill in details -->
    \`\`\`
    
    Conclusion:
    - List of changes or improvements made
    - Specific suggestions for further enhancements
    - Any code snippets or configuration examples that complement the README
    `,
    userPrompt: prompt,
    ...(prompt.includes("The previous messages are:") ? {} : { previousReadme: readme }),
  };
  

  try {
    const stream = await connectAI(JSON.stringify(updatedPrompt), model || "gemini-2.0-flash");

    const responseStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of streamResponse(stream)) {
          controller.enqueue(new TextEncoder().encode(chunk));
        }
        controller.close();
      },
    });

    return new Response(responseStream, {
      headers: {
        "Content-Type": "text/plain",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Error in /api/fetch/airesponse/generate:", error);
    return new Response(JSON.stringify({ message: "Error generating response" }), { status: 500 });
  }
}
