import time
import re
from collections import defaultdict

_rate_limit_store: dict[str, list[float]] = defaultdict(list)
RATE_LIMIT = 20
WINDOW = 3600  # 1 hour

INJECTION_PATTERNS = [
    r"ignore previous instructions",
    r"ignore all instructions",
    r"system prompt",
    r"you are now",
    r"forget your",
    r"disregard",
    r"override",
    r"jailbreak",
    r"act as",
    r"pretend (you are|to be)",
    r"new instructions",
]


def check_rate_limit(ip: str) -> bool:
    now = time.time()
    timestamps = _rate_limit_store[ip]
    _rate_limit_store[ip] = [t for t in timestamps if now - t < WINDOW]
    if len(_rate_limit_store[ip]) >= RATE_LIMIT:
        return False
    _rate_limit_store[ip].append(now)
    return True


def sanitize_input(text: str) -> tuple[str, bool]:
    """Returns (cleaned_text, is_suspicious)."""
    cleaned = text.strip()[:500]
    lower = cleaned.lower()
    for pattern in INJECTION_PATTERNS:
        if re.search(pattern, lower):
            return cleaned, True
    return cleaned, False


DEFLECT_MESSAGE = (
    "I'm Rohith's professional AI — I can only discuss his work, projects, "
    "experience, and skills. Try asking something like 'What has Rohith built in GenAI?' "
    "or 'Tell me about CodeSage.'"
)

INJECTION_MESSAGE = (
    "That query looks unusual. I'm here to answer professional questions about Rohith's work. "
    "What would you like to know about his projects or experience?"
)

RATE_LIMIT_MESSAGE = (
    "You've sent quite a few messages! Please wait a few minutes before asking more. "
    "In the meantime, check out the projects section above."
)
