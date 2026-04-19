import logging
from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import json
from services.agent_service import handle_chat
from services.guardrails import (
    check_rate_limit, sanitize_input,
    INJECTION_MESSAGE, RATE_LIMIT_MESSAGE,
)

logger = logging.getLogger(__name__)
router = APIRouter()


class ChatRequest(BaseModel):
    query: str


async def event_stream(query: str):
    logger.info(f"[Stream] Starting pipeline for query: {query!r}")
    try:
        async for chunk in handle_chat(query):
            yield f"data: {json.dumps({'chunk': chunk})}\n\n"
        yield "data: [DONE]\n\n"
        logger.info("[Stream] Pipeline completed successfully")
    except Exception as e:
        logger.error(f"[Stream] Unhandled pipeline exception: {type(e).__name__}: {e}", exc_info=True)
        yield f"data: {json.dumps({'error': f'Agent error: {type(e).__name__}: {str(e)}'})}\n\n"
        yield "data: [DONE]\n\n"


@router.post("/chat")
async def chat(request: Request, body: ChatRequest):
    ip = request.client.host if request.client else "unknown"
    origin = request.headers.get("origin", "no-origin")
    logger.info(f"[Chat] Request from ip={ip} origin={origin!r} query={body.query!r}")

    if not check_rate_limit(ip):
        logger.warning(f"[Chat] Rate limit hit for ip={ip}")
        async def rate_limited():
            yield f"data: {json.dumps({'chunk': RATE_LIMIT_MESSAGE})}\n\n"
            yield "data: [DONE]\n\n"
        return StreamingResponse(rate_limited(), media_type="text/event-stream")

    cleaned, suspicious = sanitize_input(body.query)

    if suspicious:
        logger.warning(f"[Chat] Injection attempt from ip={ip}: {body.query!r}")
        async def injection_response():
            yield f"data: {json.dumps({'chunk': INJECTION_MESSAGE})}\n\n"
            yield "data: [DONE]\n\n"
        return StreamingResponse(injection_response(), media_type="text/event-stream")

    if not cleaned:
        async def empty_response():
            yield f"data: {json.dumps({'chunk': 'Please ask me something!'})}\n\n"
            yield "data: [DONE]\n\n"
        return StreamingResponse(empty_response(), media_type="text/event-stream")

    logger.info(f"[Chat] Dispatching to pipeline: {cleaned!r}")
    return StreamingResponse(
        event_stream(cleaned),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
