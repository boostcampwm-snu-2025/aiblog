import { Router } from 'express';
import axios from 'axios';

const router = Router();

router.get('/login', (_req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    redirect_uri: process.env.GITHUB_CALLBACK_URL!,
    scope: 'repo read:user', // 1주차는 공개레포만이면 'public_repo read:user'로 축소 가능
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
});

router.get('/callback', async (req, res) => {
  const code = req.query.code as string | undefined;
  if (!code) return res.status(400).send('Missing code');

  try {
    const tokenRes = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID!,
        client_secret: process.env.GITHUB_CLIENT_SECRET!,
        code,
        redirect_uri: process.env.GITHUB_CALLBACK_URL!
      },
      { headers: { Accept: 'application/json' } }
    );

    const { access_token } = tokenRes.data;
    if (!access_token) return res.status(400).send('Token exchange failed');

    // 세션에 저장
    (req.session as any).ghToken = access_token;
    res.redirect(`${process.env.CLIENT_ORIGIN}/`); // 로그인 후 메인으로
  } catch (e: any) {
    res.status(500).json({ error: 'OAuth failed', detail: e?.message });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.status(204).end();
  });
});

router.get('/me', async (req, res) => {
  const ghToken = (req.session as any).ghToken;
  if (!ghToken) return res.json({ authenticated: false });

  // 토큰만 확인 (필요하면 사용자 프로필 호출해서 반환)
  return res.json({ authenticated: true });
});

export default router;
