import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function summarizeCommit(commit) {
  const { message, messageHeadline } = commit;
  const prompt = `
You are an expert software doc writer.
Summarize the commit for a developer blog in Korean.
- 2~3문장, 핵심 변화와 이유
- 영향(버그 픽스/리팩터/성능/보안 등) 한 줄
Commit headline: ${messageHeadline}
Commit message:
"""
${message}
"""`;
  const r = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3
  });
  return r.choices[0].message.content.trim();
}

export async function summarizePR(pr) {
  const prompt = `
다음 Pull Request 내용을 개발 블로그용으로 3~4문장 요약하세요(한국어).
마지막 줄에 "영향:"으로 시작해 영향도를 한 문장으로 적으세요.
제목: ${pr.title}
본문:
"""
${pr.body || '(no body)'}
"""`;
  const r = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3
  });
  return r.choices[0].message.content.trim();
}
