import os
import logging
import asyncio
import httpx

logger = logging.getLogger(__name__)

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")
GITHUB_BRAIN_REPO = os.getenv("GITHUB_BRAIN_REPO", "rohithdharavathu/rohith-brain")
GITHUB_BRAIN_BRANCH = os.getenv("GITHUB_BRAIN_BRANCH", "main")

VALID_NODES = {
    "about", "resume", "skills", "publications",
    "experience/hdfc", "experience/trianz",
    "projects/codesage", "projects/nl-to-sql",
    "projects/agentic-learning", "projects/portfolio",
}


async def _fetch_once(client: httpx.AsyncClient, node_path: str) -> str:
    url = f"https://api.github.com/repos/{GITHUB_BRAIN_REPO}/contents/{node_path}.md"
    headers = {
        "Accept": "application/vnd.github.v3.raw",
        "User-Agent": "rohith-portfolio-backend",
    }
    if GITHUB_TOKEN:
        headers["Authorization"] = f"token {GITHUB_TOKEN}"
    else:
        logger.warning("GITHUB_TOKEN not set — fetching public content only")

    logger.info(f"[GitHub] Fetching: {url}")
    response = await client.get(url, headers=headers)
    logger.info(f"[GitHub] {node_path} → HTTP {response.status_code}")

    if response.status_code == 200:
        content = response.text
        logger.info(f"[GitHub] {node_path} → {len(content)} chars fetched")
        return content
    elif response.status_code == 404:
        logger.error(f"[GitHub] {node_path}.md NOT FOUND in {GITHUB_BRAIN_REPO} — check file exists")
        return ""
    elif response.status_code == 401:
        logger.error(f"[GitHub] 401 Unauthorized — GITHUB_TOKEN is invalid or missing")
        return ""
    else:
        logger.error(f"[GitHub] {node_path} unexpected status {response.status_code}: {response.text[:200]}")
        return ""


async def fetch_markdown(node_path: str) -> str:
    if node_path not in VALID_NODES:
        logger.warning(f"[GitHub] Node '{node_path}' not in VALID_NODES — skipping")
        return ""

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            content = await _fetch_once(client, node_path)
            if not content:
                # One retry
                logger.info(f"[GitHub] Retrying {node_path}...")
                await asyncio.sleep(0.5)
                content = await _fetch_once(client, node_path)
            return content
    except httpx.TimeoutException:
        logger.error(f"[GitHub] Timeout fetching {node_path}")
        return ""
    except Exception as e:
        logger.error(f"[GitHub] Exception fetching {node_path}: {e}")
        return ""


async def fetch_multiple(nodes: list[str]) -> dict[str, str]:
    logger.info(f"[GitHub] Fetching nodes: {nodes}")
    tasks = [fetch_markdown(node) for node in nodes]
    results = await asyncio.gather(*tasks, return_exceptions=True)

    out: dict[str, str] = {}
    for node, result in zip(nodes, results):
        if isinstance(result, Exception):
            logger.error(f"[GitHub] Exception for node '{node}': {result}")
            out[node] = ""
        else:
            out[node] = result or ""

    fetched = [n for n, v in out.items() if v]
    empty = [n for n, v in out.items() if not v]
    logger.info(f"[GitHub] Successfully fetched: {fetched}")
    if empty:
        logger.warning(f"[GitHub] Empty/failed nodes: {empty}")

    return out
