import os
import json
from anthropic import AsyncAnthropic
from .github_service import fetch_multiple
from prompts.router_prompt import ROUTER_SYSTEM_PROMPT
from prompts.persona_prompt import PERSONA_SYSTEM_PROMPT
from typing import AsyncGenerator

client = AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY", ""))
MODEL = "claude-sonnet-4-6"


async def route_query(query: str) -> dict:
    """Call 1: Determine which knowledge nodes to fetch."""
    message = await client.messages.create(
        model=MODEL,
        max_tokens=256,
        system=ROUTER_SYSTEM_PROMPT,
        messages=[{"role": "user", "content": query}],
    )
    raw = message.content[0].text.strip()
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        # Try to extract JSON from the response
        import re
        match = re.search(r'\{.*\}', raw, re.DOTALL)
        if match:
            return json.loads(match.group())
        return {"nodes": ["about"]}


async def stream_answer(query: str, knowledge: dict[str, str]) -> AsyncGenerator[str, None]:
    """Call 2: Stream an answer in Rohith's voice."""
    knowledge_text = "\n\n".join(
        f"## {node}\n{content}"
        for node, content in knowledge.items()
        if content
    )
    if not knowledge_text:
        knowledge_text = "No specific knowledge files available for this query."

    system = PERSONA_SYSTEM_PROMPT + f"\n\n---\n\nKNOWLEDGE FILES:\n{knowledge_text}"

    async with client.messages.stream(
        model=MODEL,
        max_tokens=512,
        system=system,
        messages=[{"role": "user", "content": query}],
    ) as stream:
        async for text in stream.text_stream:
            yield text


async def handle_chat(query: str) -> AsyncGenerator[str, None]:
    """Full two-call pipeline: route → fetch → stream answer."""
    routing = await route_query(query)

    if routing.get("deflect"):
        yield "I'm Rohith's professional AI — I can only answer questions about his work, projects, and experience. Try: 'What has Rohith built in GenAI?' or 'How does CodeSage work?'"
        return

    nodes = routing.get("nodes", ["about"])
    knowledge = await fetch_multiple(nodes)

    async for chunk in stream_answer(query, knowledge):
        yield chunk
