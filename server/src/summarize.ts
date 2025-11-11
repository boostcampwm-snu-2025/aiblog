export async function summarizeMarkdown(items: {title:string; message?:string; url:string; committedAt:string}[], apiKey?: string, lang: 'ko'|'en'='ko', tone: 'blog'|'concise'='blog') {
    if (!apiKey) throw new Error('OPENAI_API_KEY missing');
    const sys = `You are a senior developer who writes clear ${lang==='ko'?'Korean':'English'} dev blog posts. Use markdown. Start with an executive summary, then bullet highlights, then “What I learned”. Include relevant links only if provided.`;
    const user = JSON.stringify(items);
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: tone==='blog'?0.7:0.2,
        messages: [ { role:'system', content: sys }, { role:'user', content: user } ]
      })
    });
    if (!res.ok) throw new Error(await res.text());
    const json = await res.json();
    return json.choices?.[0]?.message?.content ?? '# 요약 생성 실패\n입력이 부족합니다.';
  }