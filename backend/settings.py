from pathlib import Path

from pydantic_settings import BaseSettings

# 프로젝트 루트 디렉토리 찾기
BASE_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = BASE_DIR / ".env"

class AuthSettings(BaseSettings):
    GITHUB_CLIENT_ID: str = ""
    GITHUB_CLIENT_SECRET: str = ""
    GITHUB_AUTH_URL: str = ""
    GITHUB_TOKEN_URL: str = ""
    GITHUB_API_URL: str = ""

    class Config:
        env_file = str(ENV_FILE)
        env_file_encoding = "utf-8"
        extra = "ignore"

AUTH_SETTINGS = AuthSettings()