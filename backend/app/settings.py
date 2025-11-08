import os

from pydantic_settings import BaseSettings

class AuthSettings(BaseSettings):
    GITHUB_CLIENT_ID: str = ""
    GITHUB_CLIENT_SECRET: str = ""
    GITHUB_AUTH_URL: str = ""
    GITHUB_TOKEN_URL: str = ""
    GITHUB_API_URL: str = ""

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

AUTH_SETTINGS = AuthSettings()