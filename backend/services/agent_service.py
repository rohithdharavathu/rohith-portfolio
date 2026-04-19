import os
import json
import logging
import re
from anthropic import AsyncAnthropic
from .github_service import fetch_multiple_nodes
from prompts.router_prompt import ROUTER_PROMPT
from prompts.persona_prompt import PERSONA_PROMPT
from typing import AsyncGenerator

logger = logging.getLogger(__name__)

client = AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY", ""))
MODEL = "claude-sonnet-4-6"

DEFAULT_NODES = ["about", "resume"]

FALLBACK_MESSAGE = (
    "I'm having trouble reaching my knowledge base right now. "
    "Reach out directly at rohith.dharavathu.112@gmail.com or +91 9705816112"
)

# Inline knowledge used when GitHub fetch fails for a node.
# Keeps the agent functional even if brain repo files are missing.
INLINE_KNOWLEDGE: dict[str, str] = {
    "projects/codesage": """
## CodeSage AI

CodeSage is Rohith's flagship side project — a GitHub codebase intelligence tool that lets
developers ask natural-language questions about any repo and get precise, grounded answers.

### The core insight
Most code-search tools embed everything into a vector DB and do fuzzy semantic search.
CodeSage rejects that approach entirely. Instead it builds a **logical tree** from the repo:

1. **AST parsing** — uses tree-sitter to parse every file into an Abstract Syntax Tree,
   extracting functions, classes, imports, and call relationships.
2. **Knowledge graph** — stores these relationships in a NetworkX directed graph.
   Nodes are symbols (functions, classes, modules); edges are "calls", "imports", "defines".
3. **Logical tree retrieval** — when a question arrives, CodeSage traverses the graph
   to find the exact nodes relevant to the question, then assembles a minimal context
   window — no hallucinated chunks, no irrelevant noise.

### Why no vector DB?
Vector similarity retrieval retrieves *semantically similar* text, not *logically related* code.
Two functions can be semantically similar but have nothing to do with each other structurally.
The graph approach gives precise, deterministic retrieval.

### Tech stack
- Python, FastAPI (backend API)
- tree-sitter (multi-language AST parsing)
- NetworkX (knowledge graph)
- Anthropic Claude API (question answering over the graph context)
- GitHub API (repo ingestion)
- Redis (caching parsed graphs)

### Status
In active development. Rohith builds this out of pure curiosity — it's a direct application
of the same logical-tree RAG pattern used in this portfolio's AI agent.
""",

    "projects/nl-to-sql": """
## NL-to-SQL Engine

A natural-language to SQL engine that translates plain English questions into accurate SQL
queries against arbitrary schemas, with built-in validation and retry logic.

### Architecture
1. **Schema retriever** — extracts table/column metadata from the target database.
2. **Chain-of-thought planner** — sends the schema + question to Claude with a CoT prompt
   that reasons step-by-step before emitting SQL.
3. **LLM validator** — a second Claude call reviews the generated SQL for correctness
   against the schema before it is executed.
4. **Retry loop** — if validation fails, the error is fed back to the planner for up to
   3 self-correction attempts.

### Tech stack
Python, DuckDB, Anthropic Claude API, FastAPI.

### Key design decisions
- DuckDB for fast in-process analytical queries without a server.
- Two-call LLM pattern (generate → validate) reduces hallucinated column names to near zero.
- Retry loop with error feedback mimics human "write → review → fix" workflow.
""",

    "projects/agentic-learning": """
## Agentic AI Adaptive Learning System

An adaptive learning platform where an AI agent personalises lesson content and pacing
for each student in real time. Built for and won an internal Trianz Agentic AI hackathon
in September 2025.

### How it works
- A LangChain agent orchestrates the learning loop: assess → teach → quiz → adapt.
- OpenAI APIs power content generation and comprehension scoring.
- Student state (progress, weak topics, learning velocity) is persisted in DynamoDB.
- AWS Lambda handles serverless execution; API Gateway exposes the endpoints.
- FastAPI provides a developer-facing management API.

### Tech stack
LangChain, OpenAI APIs, FastAPI, AWS Lambda, AWS DynamoDB, API Gateway, Python.
""",

    "projects/portfolio": """
## This Portfolio Website

Rohith's AI-native portfolio — built with Claude Code (vibe coding), deployed on
Vercel (frontend) + Railway (backend).

### Architecture
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, Framer Motion.
- **Backend**: FastAPI (Python), hosted on Railway.
- **AI agent**: Two-call pipeline — intent router (Claude) → knowledge fetch (GitHub) →
  persona synthesiser (Claude streaming SSE).
- **Knowledge base**: Markdown files in a private GitHub repo fetched at query time
  (logical tree RAG — no vector DB, same principle as CodeSage).
- **Auth / rate limiting**: IP-based rate limiting + prompt-injection guardrails in FastAPI.

### Notable details
- The entire codebase was built using Claude Code's agentic mode.
- The AI agent speaks in Rohith's voice, grounded only in his real knowledge files.
- CORS handled by a custom DynamicCORSMiddleware that allows any *.vercel.app subdomain.
""",
}


def _supplement_with_inline(nodes: list[str], knowledge: dict[str, str]) -> dict[str, str]:
    """Fill in any nodes that GitHub failed to fetch using INLINE_KNOWLEDGE."""
    supplemented = dict(knowledge)
    for node in nodes:
        if node not in supplemented and node in INLINE_KNOWLEDGE:
            logger.info(f"[Agent] Using inline fallback for node='{node}'")
            supplemented[node] = INLINE_KNOWLEDGE[node]
    return supplemented


async def route_query(query: str) -> dict:
    """Call 1: Determine which knowledge nodes to fetch."""
    logger.info(f"[Router] Query: {query!r}")
    try:
        message = await client.messages.create(
            model=MODEL,
            max_tokens=256,
            system=ROUTER_PROMPT,
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
                logger.warning("[Router] Could not parse JSON — defaulting")
                result = {"nodes": DEFAULT_NODES}

        if not result.get("nodes") and not result.get("deflect"):
            logger.warning("[Router] Empty nodes without deflect — using defaults")
            result["nodes"] = DEFAULT_NODES

        logger.info(f"[Router] Final routing → nodes={result.get('nodes')}, deflect={result.get('deflect', False)}")
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
        logger.error("[Persona] No knowledge content available")
        yield FALLBACK_MESSAGE
        return

    logger.info(f"[Persona] Knowledge total chars: {len(knowledge_text)}")
    system = PERSONA_PROMPT.replace("{knowledge_content}", knowledge_text)

    try:
        async with client.messages.stream(
            model=MODEL,
            max_tokens=512,
            system=system,
            messages=[{"role": "user", "content": query}],
        ) as stream:
            async for text in stream.text_stream:
                yield text
        logger.info("[Persona] Stream completed")
    except Exception as e:
        logger.error(
            f"[Persona] Streaming error: {type(e).__name__}: {e} | "
            f"API key set: {bool(os.getenv('ANTHROPIC_API_KEY'))}",
            exc_info=True,
        )
        yield FALLBACK_MESSAGE


async def handle_chat(query: str) -> AsyncGenerator[str, None]:
    """Full two-call pipeline: route → fetch → stream answer."""
    # ── Step 1: Route ──────────────────────────────────────────────
    try:
        routing = await route_query(query)
        logger.info(f"[Agent] Routing result: {routing}")
    except Exception as e:
        logger.error(f"[Agent] route_query raised: {type(e).__name__}: {e}", exc_info=True)
        yield FALLBACK_MESSAGE
        return

    if routing.get("deflect"):
        logger.info("[Agent] Deflecting off-topic query")
        yield (
            "I'm Rohith's professional AI — I can only answer questions about his work, "
            "projects, and experience. Try asking: 'What has Rohith built in GenAI?' "
            "or 'What does he do at HDFC Bank?'"
        )
        return

    # ── Step 2: Fetch knowledge nodes ─────────────────────────────
    nodes = routing.get("nodes") or DEFAULT_NODES
    logger.info(f"[Agent] Fetching nodes: {nodes}")
    try:
        knowledge = await fetch_multiple_nodes(nodes)
    except Exception as e:
        logger.error(f"[Agent] fetch_multiple_nodes raised: {type(e).__name__}: {e}", exc_info=True)
        yield FALLBACK_MESSAGE
        return

    # Supplement GitHub failures with inline fallback knowledge
    knowledge = _supplement_with_inline(nodes, knowledge)

    if not knowledge:
        logger.error(f"[Agent] All node fetches failed and no inline fallback for nodes={nodes}")
        yield FALLBACK_MESSAGE
        return

    logger.info(f"[Agent] Knowledge loaded: {list(knowledge.keys())} ({sum(len(v) for v in knowledge.values())} chars total)")

    # ── Step 3: Stream answer ──────────────────────────────────────
    try:
        async for chunk in stream_answer(query, knowledge):
            yield chunk
    except Exception as e:
        logger.error(f"[Agent] stream_answer raised: {type(e).__name__}: {e}", exc_info=True)
        yield FALLBACK_MESSAGE
