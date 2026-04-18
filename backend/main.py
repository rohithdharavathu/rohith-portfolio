import os
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)

from routers import agent, content

app = FastAPI(
    title="Rohith Portfolio API",
    description="Backend for Rohith Dharavathu's AI-native portfolio",
    version="1.0.0",
)

EXPLICIT_ORIGINS = {
    "https://rohith-portfolio-seven.vercel.app",
    "https://rohith-portfolio-10k83ptne-rohithdharavathus-projects.vercel.app",
    "http://localhost:3000",
    "http://localhost:3001",
}

def _extra_allowed_origins() -> set:
    raw = os.getenv("ALLOWED_ORIGINS", "")
    if not raw:
        return set()
    return {o.strip() for o in raw.split(",") if o.strip()}

def is_allowed_origin(origin: str | None) -> bool:
    if not origin:
        return False
    all_origins = EXPLICIT_ORIGINS | _extra_allowed_origins()
    if origin in all_origins:
        return True
    # Allow any *.vercel.app subdomain
    if origin.endswith(".vercel.app") and origin.startswith("https://"):
        return True
    return False


class DynamicCORSMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        origin = request.headers.get("origin")
        allowed = is_allowed_origin(origin)

        # Handle preflight
        if request.method == "OPTIONS":
            response = Response(status_code=204)
            if allowed and origin:
                response.headers["Access-Control-Allow-Origin"] = origin
                response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
                response.headers["Access-Control-Allow-Headers"] = "*"
                response.headers["Access-Control-Allow-Credentials"] = "true"
                response.headers["Access-Control-Max-Age"] = "600"
            return response

        response = await call_next(request)
        if allowed and origin:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Vary"] = "Origin"
        return response


app.add_middleware(DynamicCORSMiddleware)

app.include_router(agent.router, prefix="/agent", tags=["agent"])
app.include_router(content.router, prefix="/content", tags=["content"])


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "rohith-portfolio-api",
        "env_check": {
            "has_anthropic_key": bool(os.getenv("ANTHROPIC_API_KEY")),
            "has_github_token": bool(os.getenv("GITHUB_TOKEN")),
            "brain_repo": os.getenv("GITHUB_BRAIN_REPO", "NOT SET"),
        },
    }


@app.get("/test-brain")
async def test_brain():
    """Debug endpoint: fetch about.md and return first 200 chars or error."""
    from services.github_service import fetch_node
    try:
        content = await fetch_node("about")
        return {"status": "ok", "preview": content[:200], "total_chars": len(content)}
    except Exception as e:
        return {"status": "error", "error": str(e)}
