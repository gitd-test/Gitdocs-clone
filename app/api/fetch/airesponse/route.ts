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
      let buffer = ""; // Accumulated text buffer
      let startTagFound = false;
      let newBuffer = "";
      let newStartTagFound = false;
      let responseCompleted = false;

      try {
        for await (const chunk of result.stream) {
          // Append the current chunk to the buffer
          buffer += chunk.text();

          const startTag = "<response>";
          const endTag = "</response>";

          // Process the buffer when the start tag is found
          if (buffer.includes(startTag) && !startTagFound) {
            const startIndex = buffer.indexOf(startTag) + startTag.length;
            buffer = buffer.substring(startIndex); // Trim the buffer to exclude the start tag
            startTagFound = true;
          }

          // Check if the end tag exists in the buffer
          if (startTagFound && buffer.includes(endTag)) {
            const endIndex = buffer.indexOf(endTag);

            // Extract and sanitize content up to the end tag
            const extractedText = buffer.substring(0, endIndex).trim();
            const sanitizedText = extractedText.replace(/```/g, "");

            // Enqueue the sanitized text and stop streaming
            controller.enqueue(encoder.encode(sanitizedText));
            responseCompleted = true;
          } else if (startTagFound) {
            // If only part of the content is available, enqueue it and keep waiting for the rest
            const sanitizedText = buffer.replace(/```/g, "");
            controller.enqueue(encoder.encode(sanitizedText));
            buffer = ""; // Reset the buffer for the next chunk
          }

          const newStartTag = "<readme>";
          const newEndTag = "</readme>";

          if (responseCompleted) {
            newBuffer += chunk.text();
            if (newBuffer.includes(newStartTag) && !newStartTagFound) {
              const startIndex = newBuffer.indexOf(newStartTag) + newStartTag.length;
              newBuffer = newBuffer.substring(startIndex);
              newStartTagFound = true;

            }

            if (newBuffer.includes(newEndTag) && newStartTagFound) {
              const endIndex = newBuffer.indexOf(newEndTag);
              newBuffer = newBuffer.substring(0, endIndex).trim();
              const sanitizedText = newBuffer.replace(/```/g, "");
              controller.enqueue(encoder.encode(sanitizedText));
              break;
            } else if (newStartTagFound) {
              const sanitizedText = newBuffer.replace(/```/g, "");
              controller.enqueue(encoder.encode(sanitizedText));
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
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
