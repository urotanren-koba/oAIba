from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # APIキー
    GOOGLE_MAPS_API_KEY: str
    OPENAI_API_KEY: str

    # CORSの設定
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:5500", "http://127.0.0.1:5500"]

    # デバッグモード
    DEBUG: bool = True

    model_config = {
        "env_file": ".env",
        "extra": "allow"  # 追加のフィールドを許可
    }

settings = Settings()