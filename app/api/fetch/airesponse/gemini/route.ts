import { connectGemini } from "@/app/api/lib/ai/connectGemini";
import { NextResponse, NextRequest } from "next/server";
import { systemPrompt } from "@/app/api/lib/ai/systemPrompt";
import { getRepositoryByNamePopulated } from "@/app/api/auth/repository/clientRepositoryServices";
import { fetchReadmeDb } from "../../../auth/repository/updateReadmeDb";
import connectMongoWithRetry from "@/app/api/lib/db/connectMongo";

export async function POST(request: NextRequest) {
  const userId = request.headers.get("Authorization")?.split(" ")[1];

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectMongoWithRetry();

  const body = await request.json();
  const prompt = body.prompt;
  const doc_name = body.doc_name;
  const model = body.model;

  if (!prompt || !doc_name || !model) {
    return NextResponse.json({ error: "Prompt, doc_name and model are required" }, { status: 400 });
  }

  const repository = await getRepositoryByNamePopulated(doc_name);
  if (!repository) {
    return NextResponse.json({ error: "Repository not found" }, { status: 404 });
  }

  const repositoryId = repository.repositoryId;
  const readme = await fetchReadmeDb(repositoryId);

  const updatedPrompt = {
    systemPrompt: `
    Do not respons in JSON format, just respond in this block format. In format :
    <response>Your response to the user's message just the text not markdown or update or reason, in this section dont include #</response>
    <update>true or false</update>
    <readme>The updated README.md file, start this section with # (project_name) replace this with the actual name of the project</readme>
    <conclusion>Reason for the update</conclusion>
    VERY IMPORTANT: give the response in the block format above, dont include any other text or markdown or update or reason or conclusion, just the text.
    ${systemPrompt()}`,
    userPrompt: prompt,
    previousReadme: readme,
  };

  const result = await connectGemini(userId, JSON.stringify(updatedPrompt), model);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  // Create a ReadableStream that processes the async stream output.
  const streamText = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      let buffer = "";
      let startTagFound = false;
      let newBuffer = "";
      let newStartTagFound = false;
      let responseCompleted = false;

      try {
        // Cast result.stream to an async iterable.
        const stream = result.stream as unknown as AsyncIterable<any>;
        for await (const chunk of stream) {
          // Get the chunk text (if chunk is not already a string)
          const chunkText = typeof chunk === "string" ? chunk : await chunk.text();
          buffer += chunkText;

          const startTag = "<response>";
          const endTag = "</response>";

          if (buffer.includes(startTag) && !startTagFound && !responseCompleted) {
            const startIndex = buffer.indexOf(startTag) + startTag.length;
            buffer = buffer.substring(startIndex);
            startTagFound = true;
          } else if (startTagFound && buffer.includes(endTag) && !responseCompleted) {
            const endIndex = buffer.indexOf(endTag);
            const extractedText = buffer.substring(0, endIndex).trim();
            const sanitizedText = extractedText.replace(/```/g, "");
            for (const char of sanitizedText) {
              controller.enqueue(encoder.encode(char));
            }
            responseCompleted = true;
          } else if (startTagFound && !buffer.includes(endTag) && !responseCompleted) {
            const sanitizedText = buffer.replace(/```/g, "");
            for (const char of sanitizedText) {
              controller.enqueue(encoder.encode(char));
            }
            buffer = "";
          }

          const newStartTag = "<readme>";
          const newEndTag = "</readme>";

          if (responseCompleted) {
            newBuffer += chunkText;
            if (newBuffer.includes(newStartTag) && !newStartTagFound) {
              const startIndex = newBuffer.indexOf(newStartTag) + newStartTag.length;
              newBuffer = newBuffer.substring(startIndex);
              newStartTagFound = true;
            } else if (newBuffer.includes(newEndTag) && newStartTagFound) {
              const endIndex = newBuffer.indexOf(newEndTag);
              newBuffer = newBuffer.substring(0, endIndex).trim();
              for (const char of newBuffer) {
                controller.enqueue(encoder.encode(char));
              }
              break;
            } else if (newStartTagFound && !newBuffer.includes(newEndTag)) {
              for (const char of newBuffer) {
                controller.enqueue(encoder.encode(char));
              }
              newBuffer = "";
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
    headers: { "Content-Type": "text/plain" },
  });
}
