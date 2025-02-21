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
      let buffer = ""; // For processing `<response>` content
      let readmeBuffer = ""; // For processing `<readme>` content
      let isResponseComplete = false;
      let responseStarted = false;
      let readmeStarted = false;

      try {
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();

          console.log("Received chunk:", chunkText);

          // Process <response> block
          if (!isResponseComplete) {
            buffer += chunkText;

            const startTag = "<response>";
            const endTag = "</response>";

            if (buffer.includes(startTag) && !responseStarted) {
              const startIndex = buffer.indexOf(startTag) + startTag.length;
              buffer = buffer.substring(startIndex);
              responseStarted = true;
            }

            if (buffer.includes(endTag)) {
              const endIndex = buffer.indexOf(endTag);
              const responseContent = buffer.substring(0, endIndex).trim().replace(/```/g, "");
              controller.enqueue(encoder.encode(responseContent));
              isResponseComplete = true;

              console.log("Processed <response>:", responseContent);

              buffer = buffer.substring(endIndex + endTag.length);
            }
          }

          // Process <readme> block after <response> is complete
          if (isResponseComplete) {
            readmeBuffer += chunkText;

            const startTag = "<readme>";
            const endTag = "</readme>";

            if (readmeBuffer.includes(startTag) && !readmeStarted) {
              const startIndex = readmeBuffer.indexOf(startTag) + startTag.length;
              readmeBuffer = readmeBuffer.substring(startIndex);
              readmeStarted = true;
            }

            if (readmeBuffer.includes(endTag)) {
              const endIndex = readmeBuffer.indexOf(endTag);
              const readmeContent = readmeBuffer.substring(0, endIndex).trim().replace(/```/g, "");
              controller.enqueue(encoder.encode(readmeContent));

              console.log("Processed <readme>:", readmeContent);

              break; // End the stream after processing <readme>
            }
          }
        }

        controller.close();
      } catch (error) {
        console.error("Error in ReadableStream:", error);
        controller.error(error);
      }
    },
  });

  return new Response(streamText, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
