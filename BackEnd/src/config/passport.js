const passport = require('passport')
const GitHubStrategy = require('passport-github2').Strategy

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || ''
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || ''
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL || 'http://localhost:8000/api/auth/github/callback'

/**
 * GitHub OAuth 전략 설정
 */
passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: GITHUB_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      // GitHub 프로필 정보를 TokenPayload로 변환
      const user = {
        id: profile.id,
        login: profile.username || profile.login || '',
        email: profile.emails?.[0]?.value || null,
        avatar_url: profile.photos?.[0]?.value || profile.avatar_url || '',
        githubAccessToken: accessToken, // GitHub의 실제 액세스 토큰 저장
      }

      return done(null, user)
    }
  )
)

module.exports = passport
