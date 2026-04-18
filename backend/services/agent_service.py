import os
import json
import logging
import re
from anthropic import AsyncAnthropic
from .github_service import fetch_multiple
from prompts.router_prompt import ROUTER_SYSTEM_PROMPT
from prompts.persona_prompt import PERSONA_SYSTEM_PROMPT
from typing import AsyncGenerator

logger = logging.getLogger(__name__)

client = AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY", ""))
MODEL = "claude-sonnet-4-6"

DEFAULT_NODES = ["about", "resume"]

FALLBACK_MESSAGE = (
    "I'm having trouble accessing my knowledge base right now. "
    "Reach out directly at rohith.dharavathu.112@gmail.com and I'll answer directly."
)


async def route_query(query: str) -> dict:
    """Call 1: Determine which knowledge nodes to fetch."""
    logger.info(f"[Router] Query: {query!r}")
    try:
        message = await client.messages.create(
            model=MODEL,
            max_tokens=256,
            system=ROUTER_SYSTEM_PROMPT,
            messages=[{"role": "user", "content": query}],
        )
        raw = message.content[0].text.strip()
        logger.info(f"[Router] Raw response: {raw!r}")

        try:
            result = json.loads(raw)
        except json.JSONDecodeError:
            match = re.search(r'\{.*\}', raw, re.DOTALL)
            if match:
                result = json.loads(match.group())
                logger.info(f"[Router] Extracted JSON from text: {result}")
            else:
                logger.warning(f"[Router] Could not parse JSON — defaulting to {DEFAULT_NODES}")
                result = {"nodes": DEFAULT_NODES}

        nodes = result.get("nodes", DEFAULT_NODES)
        deflect = result.get("deflect", False)

        # Fallback: never return empty nodes unless explicitly deflecting
        if not nodes and not deflect:
            logger.warning("[Router] Empty nodes returned without deflect — using defaults")
            result["nodes"] = DEFAULT_NODES

        logger.info(f"[Router] Final routing → nodes={result.get('nodes')}, deflect={deflect}")
        return result

    except Exception as e:
        logger.error(f"[Router] Claude API error: {e}")
        return {"nodes": DEFAULT_NODES}


async def stream_answer(query: str, knowledge: dict[str, str]) -> AsyncGenerator[str, None]:
    """Call 2: Stream an answer in Rohith's voice."""
    knowledge_text = "\n\n".join(
        f"## {node}\n{content}"
        for node, content in knowledge.items()
        if content
    )

    if not knowledge_text:
        logger.error("[Persona] No knowledge content available — all nodes were empty")
        yield FALLBACK_MESSAGE
        return

    logger.info(f"[Persona] Knowledge total chars: {len(knowledge_text)}")
    system = PERSONA_SYSTEM_PROMPT + f"\n\n---\n\nKNOWLEDGE FILES:\n{knowledge_text}"

    try:
        async with client.messages.stream(
            model=MODEL,
            max_tokens=512,
            system=system,
            messages=[{"role": "user", "content": query}],
        ) as stream:
            async for text in stream.text_stream:
                yield text
        logger.info("[Persona] Stream completed successfully")
    except Exception as e:
        logger.error(f"[Persona] Claude streaming error: {e}")
        yield FALLBACK_MESSAGE


async def handle_chat(query: str) -> AsyncGenerator[str, None]:
    """Full two-call pipeline: route → fetch → stream answer."""
    routing = await route_query(query)

    if routing.get("deflect"):
        logger.info("[Agent] Deflecting off-topic query")
        yield (
            "I'm Rohith's professional AI — I can only answer questions about his work, "
            "projects, and experience. Try asking: 'What has Rohith built in GenAI?' "
            "or 'What does he do at HDFC Bank?'"
        )
        return

    nodes = routing.get("nodes") or DEFAULT_NODES
    logger.info(f"[Agent] Fetching nodes: {nodes}")

    knowledge = await fetch_multiple(nodes)

    all_empty = all(not v for v in knowledge.values())
    if all_empty:
        logger.error(f"[Agent] All node fetches returned empty for nodes: {nodes}")
        yield FALLBACK_MESSAGE
        return

    async for chunk in stream_answer(query, knowledge):
        yield chunk
