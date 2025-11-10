/**
 * 메모리 기반 리프레시 토큰 저장소
 * 프로덕션 환경에서는 Redis나 데이터베이스 사용 권장
 */
class TokenStore {
  constructor() {
    this.tokens = new Map()
  }

  /**
   * 리프레시 토큰 저장
   */
  saveRefreshToken(token, data) {
    this.tokens.set(token, data)
  }

  /**
   * 리프레시 토큰 조회
   */
  getRefreshToken(token) {
    return this.tokens.get(token)
  }

  /**
   * 리프레시 토큰 삭제 (로그아웃 시)
   */
  deleteRefreshToken(token) {
    return this.tokens.delete(token)
  }

  /**
   * 사용자의 모든 리프레시 토큰 삭제 (완전 로그아웃)
   */
  deleteUserTokens(githubId) {
    for (const [token, data] of this.tokens.entries()) {
      if (data.githubId === githubId) {
        this.tokens.delete(token)
      }
    }
  }

  /**
   * 만료된 토큰 정리
   */
  cleanupExpiredTokens() {
    const now = new Date()
    for (const [token, data] of this.tokens.entries()) {
      if (data.expiresAt < now) {
        this.tokens.delete(token)
      }
    }
  }

  /**
   * 저장된 토큰 개수 조회 (디버깅용)
   */
  getTokenCount() {
    return this.tokens.size
  }
}

// 싱글톤 인스턴스
const tokenStore = new TokenStore()

// 주기적으로 만료된 토큰 정리 (매 시간)
setInterval(() => {
  tokenStore.cleanupExpiredTokens()
}, 60 * 60 * 1000)

module.exports = { tokenStore }
