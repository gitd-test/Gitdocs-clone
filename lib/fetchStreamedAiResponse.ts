export async function fetchStreamedResponse(userId: string, prompt: string, doc_name: string, callback: (chunk: string) => void) {
  const response = await fetch('/api/fetch/airesponse', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${userId}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, doc_name }),
  });

  if (!response.body) throw new Error("No response body");

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    let chunk = "";
    for (const char of decoder.decode(value, { stream: true })) {
      chunk += char;
    }

    callback(chunk); // Pass the chunk to a callback function
  }
}
