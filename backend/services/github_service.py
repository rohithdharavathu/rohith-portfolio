import os
import httpx
from functools import lru_cache

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")
GITHUB_BRAIN_REPO = os.getenv("GITHUB_BRAIN_REPO", "rohithdharavathu/rohith-brain")
GITHUB_BRAIN_BRANCH = os.getenv("GITHUB_BRAIN_BRANCH", "main")

VALID_NODES = {
    "about", "resume", "skills", "publications",
    "experience/hdfc", "experience/trianz",
    "projects/codesage", "projects/nl-to-sql",
    "projects/agentic-learning", "projects/portfolio",
}


async def fetch_markdown(node_path: str) -> str:
    """Fetch a markdown file from the brain GitHub repo."""
    if node_path not in VALID_NODES:
        return ""

    url = f"https://api.github.com/repos/{GITHUB_BRAIN_REPO}/contents/{node_path}.md"
    headers = {
        "Accept": "application/vnd.github.v3.raw",
        "User-Agent": "rohith-portfolio-backend",
    }
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(url, headers=headers)
        if response.status_code == 200:
            return response.text
        return ""


async def fetch_multiple(nodes: list[str]) -> dict[str, str]:
    """Fetch multiple markdown files concurrently."""
    import asyncio
    tasks = [fetch_markdown(node) for node in nodes]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    return {
        node: (result if isinstance(result, str) else "")
        for node, result in zip(nodes, results)
    }
