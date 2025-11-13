export const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
export const OPENAI_MODEL = "gpt-4o-mini";

export async function chatComplete({
	system,
	user,
	model = OPENAI_MODEL,
	temperature = 0.7,
}) {
	const apiKey = process.env.OPENAI_API_KEY;
	if (!apiKey) {
		throw new Error("Missing OPENAI_API_KEY");
	}

	const res = await fetch(OPENAI_API_URL, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model,
			temperature,
			messages: [
				system ? { role: "system", content: system } : undefined,
				{ role: "user", content: user },
			].filter(Boolean),
		}),
	});

	if (!res.ok) {
		const text = await res.text();
		throw new Error(`OpenAI error: ${res.status} ${text}`);
	}

	const data = await res.json();
	const content = data?.choices?.[0]?.message?.content || "";
	return content.trim();
}
