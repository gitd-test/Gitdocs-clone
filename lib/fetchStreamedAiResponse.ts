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
          // Wait 1ms between tokens; adjust delay as needed.
          await new Promise((resolve) => setTimeout(resolve, 1));
        }
      }
    }

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
    
      if (value) {
        let chunk = decoder.decode(value);
    
        // Handle <<readme>> marker
        if (chunk.includes("<<readme>>")) {
          const parts = chunk.split("<<readme>>");
          // Process the text before the marker in the current section.
          if (parts[0].trim().length > 0) {
            if (currentSection === "normal" || currentSection === "conclusion") {
              await updateTokenByToken(parts[0], (token: string) => {
                onUpdateMessages({ role: "assistant", content: token });
              });
            } else if (currentSection === "readme") {
              await updateTokenByToken(parts[0], onUpdateContent);
            }
          }
          // Switch to readme mode.
          currentSection = "readme";
          onUpdatePreviewContent(true);
          // Process the text after the marker as readme content.
          if (parts[1].trim().length > 0) {
            await updateTokenByToken(parts[1], onUpdateContent);
          }
          continue;
        }
        // Handle <<conclusion>> marker
        else if (chunk.includes("<<conclusion>>")) {
          const parts = chunk.split("<<conclusion>>");
          // Process text before the marker in the current section.
          if (parts[0].trim().length > 0) {
            if (currentSection === "normal" || currentSection === "conclusion") {
              await updateTokenByToken(parts[0], (token: string) => {
                onUpdateMessages({ role: "assistant", content: token });
              });
            } else if (currentSection === "readme") {
              await updateTokenByToken(parts[0], onUpdateContent);
            }
          }
          // Switch to conclusion mode.
          currentSection = "conclusion";
          onUpdatePreviewContent(false);
          // Insert a separator for the conclusion block.
          onUpdateMessages({ role: "assistant", content: "\n\nConclusion:\n" });
          // Process text after the marker.
          if (parts[1].trim().length > 0) {
            await updateTokenByToken(parts[1], (token: string) => {
              onUpdateMessages({ role: "assistant", content: token });
            });
          }
          continue;
        }
        // Handle <<end>> marker
        else if (chunk.includes("<<end>>")) {
          const parts = chunk.split("<<end>>");
          // Process any text before the <<end>> marker.
          if (parts[0].trim().length > 0) {
            if (currentSection === "normal" || currentSection === "conclusion") {
              await updateTokenByToken(parts[0], (token: string) => {
                onUpdateMessages({ role: "assistant", content: token });
              });
            } else if (currentSection === "readme") {
              await updateTokenByToken(parts[0], onUpdateContent);
            }
          }
          currentSection = "end";
          onUpdatePreviewContent(false);
          break;
        }
        // No markers in the chunk; process as usual.
        else {
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
