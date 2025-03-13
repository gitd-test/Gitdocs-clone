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
    let normalContent = "";
    let readmeContent = "";
    let conclusionContent = "";
    let inMarkdownBlock = false;
    let markdownBuffer = "";

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

    // Helper function to parse markdown code blocks
    function parseMarkdownContent(text: string): string {
      // Check if we're entering a markdown block
      if (!inMarkdownBlock && text.includes("```markdown")) {
        inMarkdownBlock = true;
        // Get content after ```markdown
        const parts = text.split("```markdown");
        // Return only the content after ```markdown
        return parts.length > 1 ? parts[1] : "";
      }
      // If we're inside a markdown block, return the content as is
      else if (inMarkdownBlock) {
        return text;
      }
      // If we're not in a markdown block and there's no markers, return as is
      else {
        return text;
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
          
          // Process the text before the marker in the current section
          if (parts[0].trim().length > 0) {
            if (currentSection === "normal") {
              normalContent += parts[0];
              await updateTokenByToken(parts[0], (token: string) => {
                onUpdateMessages({ role: "assistant", content: token });
              });
            } else if (currentSection === "readme") {
              const parsedContent = parseMarkdownContent(parts[0]);
              if (parsedContent.trim().length > 0) {
                readmeContent += parsedContent;
                await updateTokenByToken(parsedContent, onUpdateContent);
              }
            } else if (currentSection === "conclusion") {
              conclusionContent += parts[0];
              await updateTokenByToken(parts[0], (token: string) => {
                onUpdateMessages({ role: "assistant", content: token });
              });
            }
          }
          
          // Switch to readme mode
          currentSection = "readme";
          onUpdatePreviewContent(true);
          
          // Process the text after the marker as readme content
          if (parts[1] && parts[1].trim().length > 0) {
            const parsedContent = parseMarkdownContent(parts[1]);
            if (parsedContent.trim().length > 0) {
              readmeContent += parsedContent;
              await updateTokenByToken(parsedContent, onUpdateContent);
            }
          }
        }
        // Handle <<conclusion>> marker
        else if (chunk.includes("<<conclusion>>")) {
          const parts = chunk.split("<<conclusion>>");
          
          // Process text before the marker in the current section
          if (parts[0].trim().length > 0) {
            if (currentSection === "normal") {
              normalContent += parts[0];
              await updateTokenByToken(parts[0], (token: string) => {
                onUpdateMessages({ role: "assistant", content: token });
              });
            } else if (currentSection === "readme") {
              const parsedContent = parseMarkdownContent(parts[0]);
              if (parsedContent.trim().length > 0) {
                readmeContent += parsedContent;
                await updateTokenByToken(parsedContent, onUpdateContent);
              }
            } else if (currentSection === "conclusion") {
              conclusionContent += parts[0];
              await updateTokenByToken(parts[0], (token: string) => {
                onUpdateMessages({ role: "assistant", content: token });
              });
            }
          }
          
          // Switch to conclusion mode
          currentSection = "conclusion";
          onUpdatePreviewContent(false);
          
          // Insert a separator for the conclusion block
          onUpdateMessages({ role: "assistant", content: "\n\nConclusion:\n" });
          
          // Process text after the marker
          if (parts[1] && parts[1].trim().length > 0) {
            conclusionContent += parts[1];
            await updateTokenByToken(parts[1], (token: string) => {
              onUpdateMessages({ role: "assistant", content: token });
            });
          }
        }
        // Handle <<end>> marker
        else if (chunk.includes("<<end>>")) {
          const parts = chunk.split("<<end>>");
          
          // Process any text before the <<end>> marker
          if (parts[0].trim().length > 0) {
            if (currentSection === "normal") {
              normalContent += parts[0];
              await updateTokenByToken(parts[0], (token: string) => {
                onUpdateMessages({ role: "assistant", content: token });
              });
            } else if (currentSection === "readme") {
              const parsedContent = parseMarkdownContent(parts[0]);
              if (parsedContent.trim().length > 0) {
                readmeContent += parsedContent;
                await updateTokenByToken(parsedContent, onUpdateContent);
              }
            } else if (currentSection === "conclusion") {
              conclusionContent += parts[0];
              await updateTokenByToken(parts[0], (token: string) => {
                onUpdateMessages({ role: "assistant", content: token });
              });
            }
          }
          
          currentSection = "end";
          onUpdatePreviewContent(false);
          inMarkdownBlock = false; // Reset markdown state
          break;
        }
        // No markers in the chunk; process as usual
        else {
          if (currentSection === "normal") {
            normalContent += chunk;
            await updateTokenByToken(chunk, (token: string) => {
              onUpdateMessages({ role: "assistant", content: token });
            });
          } else if (currentSection === "readme") {
            const parsedContent = parseMarkdownContent(chunk);
            if (parsedContent.trim().length > 0) {
              readmeContent += parsedContent;
              await updateTokenByToken(parsedContent, onUpdateContent);
            }
          } else if (currentSection === "conclusion") {
            conclusionContent += chunk;
            await updateTokenByToken(chunk, (token: string) => {
              onUpdateMessages({ role: "assistant", content: token });
            });
          }
        }
      }
    }
    
  } catch (error) {
    console.error("Error fetching AI response:", error);
    throw error;
  }
}