- app.ts랑 server.ts를 나누는 이유
  : Node.js/Express 프로젝트에서 매우 일반적인 패턴입니다.
  역할 분담:
    app.ts - 애플리케이션 로직
    - Express 앱 인스턴스 생성
    - 미들웨어 설정 (cors, express.json 등)
    - 라우트 정의
    - 서버를 시작하지 않음 (순수 로직만)

    server.ts - 서버 실행
    - dotenv.config() → 환경변수 로드
    - 포트 정의
    - app.listen(PORT) → 실제 서버 시작


- passport?
  : Node.js의 인증(Authentication) 미들웨어입니다.
  주요 역할:
  1️⃣ 사용자 인증 처리
    로그인, 회원가입 등 사용자 검증을 담당합니다.

  2️⃣ 다양한 인증 전략 지원
    - Local (username/password)
    - OAuth (Google, GitHub, Facebook 등)
    - JWT (토큰 기반)
    - API 키 등

  3️⃣ 세션/토큰 관리
    사용자가 로그인한 상태를 유지합니다.
  
  => 보안 담당자 역할을 합니다. 사용자가 누구인지 확인하고, 인증된 사용자만 접근하도록 관리합니다.


- 