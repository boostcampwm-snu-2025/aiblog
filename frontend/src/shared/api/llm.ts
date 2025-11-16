const BASE_URL = "/api/llm";

export const generateSummary = async (title: string, content: string): Promise<string> => {
  const res = await fetch(`${BASE_URL}/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `LLM Error: ${res.status}`);
  }

  const data = await res.json();
  return data.result; // 서버에서 { result: string }
};