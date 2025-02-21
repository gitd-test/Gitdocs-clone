import { connectGemini } from "@/app/api/lib/ai/connectGemini";
import { NextResponse, NextRequest } from "next/server";
import { systemPrompt } from "@/app/api/lib/ai/systemPrompt";
import { getRepositoryByNamePopulated } from "@/app/api/auth/repository/clientRepositoryServices";
import { fetchReadmeDb } from "../../auth/repository/updateReadmeDb";

export async function POST(request: NextRequest) {
  const userId = request.headers.get("Authorization")?.split(" ")[1];

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { prompt, doc_name } = body;

  if (!prompt || !doc_name) {
    return NextResponse.json({ error: "Prompt and doc_name are required" }, { status: 400 });
  }

  const repository = await getRepositoryByNamePopulated(doc_name);

  if (!repository) {
    return NextResponse.json({ error: "Repository not found" }, { status: 404 });
  }

  const repositoryId = repository.repositoryId;
  const readme = await fetchReadmeDb(repositoryId);

  const updatedPrompt = {
    systemPrompt: systemPrompt(),
    userPrompt: prompt,
    previousReadme: readme,
  };

  const result = await connectGemini(userId, JSON.stringify(updatedPrompt));

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  const streamText = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      let buffer = ""; // For temporary chunk storage
      let responseStarted = false;
      let responseCompleted = false;
      let readmeStarted = false;

      try {
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();

          buffer += chunkText;

          // Process <response> block
          if (!responseCompleted && buffer.includes("<response>")) {
            const startIndex = buffer.indexOf("<response>") + "<response>".length;
            buffer = buffer.substring(startIndex);
            responseStarted = true;
          }

          if (responseStarted && buffer.includes("</response>")) {
            const endIndex = buffer.indexOf("</response>");
            const responseContent = buffer.substring(0, endIndex).trim().replace(/```/g, "");
            controller.enqueue(encoder.encode(responseContent + "\n"));
            responseCompleted = true;
            responseStarted = false;
            buffer = buffer.substring(endIndex + "</response>".length);
          }

          // Process <readme> block
          if (responseCompleted && buffer.includes("<readme>")) {
            const startIndex = buffer.indexOf("<readme>") + "<readme>".length;
            buffer = buffer.substring(startIndex);
            readmeStarted = true;
          }

          if (readmeStarted && buffer.includes("</readme>")) {
            const endIndex = buffer.indexOf("</readme>");
            const readmeContent = buffer.substring(0, endIndex).trim().replace(/```/g, "");
            controller.enqueue(encoder.encode(readmeContent + "\n"));
            readmeStarted = false;
            break; // End streaming after <readme>
          }
        }

        controller.close();
      } catch (error) {
        console.error("Error in stream:", error);
        controller.error(error);
      }
    },
  });

  return new Response(streamText, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
