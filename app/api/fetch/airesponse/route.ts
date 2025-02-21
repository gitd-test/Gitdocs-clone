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
  const prompt = body.prompt;
  const doc_name = body.doc_name;

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
      let responseBuffer = ""; // Buffer for <response>
      let readmeBuffer = ""; // Buffer for <readme>
      let responseCompleted = false;

      try {
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();

          // Handle <response> block
          if (!responseCompleted) {
            responseBuffer += chunkText;

            const startTag = "<response>";
            const endTag = "</response>";

            if (responseBuffer.includes(startTag)) {
              const startIndex = responseBuffer.indexOf(startTag) + startTag.length;
              responseBuffer = responseBuffer.substring(startIndex);
            }

            if (responseBuffer.includes(endTag)) {
              const endIndex = responseBuffer.indexOf(endTag);
              const extractedText = responseBuffer.substring(0, endIndex).trim();
              const sanitizedText = extractedText.replace(/```/g, "");
              controller.enqueue(encoder.encode(sanitizedText));
              responseCompleted = true;

              // Remove processed text
              responseBuffer = responseBuffer.substring(endIndex + endTag.length);
            }
          }

          // Handle <readme> block
          if (responseCompleted) {
            readmeBuffer += chunkText;

            const startTag = "<readme>";
            const endTag = "</readme>";

            if (readmeBuffer.includes(startTag)) {
              const startIndex = readmeBuffer.indexOf(startTag) + startTag.length;
              readmeBuffer = readmeBuffer.substring(startIndex);
            }

            if (readmeBuffer.includes(endTag)) {
              const endIndex = readmeBuffer.indexOf(endTag);
              const extractedText = readmeBuffer.substring(0, endIndex).trim();
              const sanitizedText = extractedText.replace(/```/g, "");
              controller.enqueue(encoder.encode(sanitizedText));
              break; // Stop processing after <readme> block
            }
          }
        }

        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(streamText, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}

