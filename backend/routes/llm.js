import express from 'express';
import { ai } from '../lib.js';

const router = express.Router();

router.post('/create-blog', express.json(), async (req, res) => {
  const { source, item, repo } = req.body || {};

  if (!source || !item || !repo) {
    return res.status(400).json({ error: 'Missing source, item, or repo in request body' });
  }

  let instruction = '';
  if (source === 'commit') {
    instruction = `나는 github commit 내역으로 간단한 블로그를 작성하려고 하는데, 너가 나의 commit을 분석해서 블로그를 작성해줘. 아래는 commit 정보이다.`;
  } else if (source === 'pr') {
    instruction = `나는 github pull request 내역으로 간단한 블로그를 작성하려고 하는데, 너가 PR 내용을 요약하고 블로그 형태로 작성해줘. 아래는 PR 정보이다.`;
  } else {
    instruction = `블로그 작성을 도와줘. 아래는 관련 정보이다.`;
  }

  const details = `Repository: ${repo.name}\nOwner: ${repo.owner}\n\nItem:\n${JSON.stringify(item, null, 2)}`;
  const promptText = `${instruction}\n\n${details}\n\n간결하고 읽기 쉬운 블로그 형태로 작성해줘.`;

  try {
    const data = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptText,
    });

    res.json({ data: data.text });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Failed to generate blog content' });
  }
});

export default router;
