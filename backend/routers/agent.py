from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import json
from services.agent_service import handle_chat
from services.guardrails import (
    check_rate_limit, sanitize_input,
    INJECTION_MESSAGE, RATE_LIMIT_MESSAGE,
)

router = APIRouter()


class ChatRequest(BaseModel):
    query: str


async def event_stream(query: str):
    try:
        async for chunk in handle_chat(query):
            yield f"data: {json.dumps({'chunk': chunk})}\n\n"
        yield "data: [DONE]\n\n"
    except Exception as e:
        yield f"data: {json.dumps({'error': 'Something went wrong. Please try again.'})}\n\n"
        yield "data: [DONE]\n\n"


@router.post("/chat")
async def chat(request: Request, body: ChatRequest):
    ip = request.client.host if request.client else "unknown"

    if not check_rate_limit(ip):
        async def rate_limited():
            yield f"data: {json.dumps({'chunk': RATE_LIMIT_MESSAGE})}\n\n"
            yield "data: [DONE]\n\n"
        return StreamingResponse(rate_limited(), media_type="text/event-stream")

    cleaned, suspicious = sanitize_input(body.query)

    if suspicious:
        async def injection_response():
            yield f"data: {json.dumps({'chunk': INJECTION_MESSAGE})}\n\n"
            yield "data: [DONE]\n\n"
        return StreamingResponse(injection_response(), media_type="text/event-stream")

    if not cleaned:
        async def empty_response():
            yield f"data: {json.dumps({'chunk': 'Please ask me something!'})}\n\n"
            yield "data: [DONE]\n\n"
        return StreamingResponse(empty_response(), media_type="text/event-stream")

    return StreamingResponse(
        event_stream(cleaned),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
