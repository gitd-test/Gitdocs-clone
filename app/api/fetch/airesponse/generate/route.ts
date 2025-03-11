import { connectAI } from "@/app/api/lib/ai/connectAI";
import { NextRequest } from "next/server";
import { systemPrompt } from "@/app/api/lib/ai/systemPrompt";
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
    Do not respond in JSON format, just respond in this block format. Format:
    normal text response to the user's message (dont write anything like there is no prior readme or context) in very detailed format dont write Response to user add double spacing always give a number list specifying the changes done or suggestions
    Readme: The updated README.md file (directly give the markdown syntax)
    Conclusion: list of changes or suggestions made (Dont write this in a code block)
    `,
    userPrompt: prompt,
    previousReadme: readme,
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
