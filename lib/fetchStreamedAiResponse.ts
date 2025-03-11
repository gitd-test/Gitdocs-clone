export async function fetchAIResponse(
  userId: string,
  prompt: string,
  docName: string,
  model: string,
  onUpdateMessages: (message: { role: string; content: string }) => void,
  onUpdateContent: (chunk: string) => void,
  onUpdatePreviewContent: (isPreviewing: boolean) => void
) {
  const endpoint = "/api/fetch/airesponse/generate"; // API endpoint

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userId}`,
      },
      body: JSON.stringify({ prompt, doc_name: docName, model }),
    });

    if (!response.body) {
      throw new Error("Response body is empty");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let currentSection = "normal";

    // Helper function to update text token by token (preserving whitespace) with a delay.
    async function updateTokenByToken(text: string, callback: (token: string) => void) {
      // This regex splits text into tokens (words, punctuation, and whitespace).
      const tokens = text.match(/(\S+|\s+)/g);
      if (tokens) {
        for (const token of tokens) {
          callback(token);
          // Wait 10ms between tokens; adjust delay as needed.
          await new Promise((resolve) => setTimeout(resolve, 10));
        }
      }
    }

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;

      if (value) {
        let chunk = decoder.decode(value);

        if (chunk.includes("<<readme>>")) {
          currentSection = "readme";
          onUpdatePreviewContent(true); // Start previewing content
          chunk = chunk.replace("<<readme>>", "");
          if (chunk.trim().length > 0) {
            await updateTokenByToken(chunk, onUpdateContent);
          }
          continue;
        } else if (chunk.includes("<<conclusion>>")) {
          currentSection = "conclusion";
          onUpdatePreviewContent(false); // Stop previewing content
          // Insert a separator for the conclusion block
          onUpdateMessages({ role: "assistant", content: "\n\nConclusion:\n" });
          chunk = chunk.replace("<<conclusion>>", "");
          if (chunk.trim().length > 0) {
            await updateTokenByToken(chunk, (token: string) => {
              onUpdateMessages({ role: "assistant", content: token });
            });
          }
          continue;
        } else if (chunk.includes("<<end>>")) {
          currentSection = "end";
          onUpdatePreviewContent(false); // Stop previewing at the end
          break;
        } else {
          if (currentSection === "normal" || currentSection === "conclusion") {
            await updateTokenByToken(chunk, (token: string) => {
              onUpdateMessages({ role: "assistant", content: token });
            });
          } else if (currentSection === "readme") {
            await updateTokenByToken(chunk, onUpdateContent);
          }
        }
      }
    }
  } catch (error) {
    console.error("Error fetching AI response:", error);
    throw error;
  }
}
