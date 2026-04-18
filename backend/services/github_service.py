import httpx
import base64
import os
import logging

logger = logging.getLogger(__name__)


async def fetch_node(node_path: str) -> str:
    """
    Fetch a markdown file from the private brain repo.
    node_path: e.g. "about", "experience/hdfc", "projects/codesage"
    """
    token = os.getenv("GITHUB_TOKEN", "")
    repo = os.getenv("GITHUB_BRAIN_REPO", "")
    branch = os.getenv("GITHUB_BRAIN_BRANCH", "main")

    if not token or not repo:
        raise Exception("Missing GITHUB_TOKEN or GITHUB_BRAIN_REPO env vars")

    file_path = f"{node_path}.md"
    url = f"https://api.github.com/repos/{repo}/contents/{file_path}"

    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "User-Agent": "rohith-portfolio-agent",
    }

    params = {"ref": branch}

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(url, headers=headers, params=params)

            logger.info(f"GitHub fetch {file_path}: status={response.status_code}")

            if response.status_code == 200:
                data = response.json()
                content_b64 = data.get("content", "")
                content_b64 = content_b64.replace("\n", "")
                content = base64.b64decode(content_b64).decode("utf-8")
                logger.info(f"Fetched {file_path}: {len(content)} chars")
                return content
            elif response.status_code == 404:
                logger.error(f"File not found: {file_path}")
                raise Exception(f"File not found: {file_path}")
            elif response.status_code == 401:
                logger.error("GitHub token unauthorized")
                raise Exception("GitHub token unauthorized")
            else:
                logger.error(f"GitHub error {response.status_code}: {response.text[:300]}")
                raise Exception(f"GitHub fetch failed: {response.status_code}")

    except httpx.TimeoutException:
        logger.error(f"Timeout fetching {file_path}")
        raise Exception(f"Timeout fetching {file_path}")


async def fetch_multiple_nodes(nodes: list[str]) -> dict[str, str]:
    """
    Fetch multiple nodes concurrently. Continues even if some fail.
    Returns dict of {node_path: content} — only includes successful fetches.
    """
    import asyncio
    results: dict[str, str] = {}

    async def fetch_one(node: str) -> None:
        try:
            content = await fetch_node(node)
            results[node] = content
        except Exception as e:
            logger.error(f"Failed to fetch node '{node}': {e}")

    await asyncio.gather(*[fetch_one(node) for node in nodes])
    logger.info(f"Fetched {len(results)}/{len(nodes)} nodes successfully: {list(results.keys())}")
    return results
