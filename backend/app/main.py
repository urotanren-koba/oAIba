from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.endpoints import router

app = FastAPI(
    title="oAIba API",
    description="Location-based meeting point optimizer API",
    version="1.0.0"
)

# CORSミドルウェアの設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 本番環境では適切なオリジンに制限すべき
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ルーターを登録
app.include_router(router, prefix="/api")

@app.get("/")
async def root():
    return {
        "message": "Welcome to oAIba API",
        "status": "active"
    }