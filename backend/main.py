import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from routers import agent, content

app = FastAPI(
    title="Rohith Portfolio API",
    description="Backend for Rohith Dharavathu's AI-native portfolio",
    version="1.0.0",
)

allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:3001"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in allowed_origins],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(agent.router, prefix="/agent", tags=["agent"])
app.include_router(content.router, prefix="/content", tags=["content"])


@app.get("/health")
async def health():
    return {"status": "ok", "service": "rohith-portfolio-api"}
