# This Portfolio — rohithdharavathu.dev

## What It Is
An AI-native portfolio website built entirely with Claude Code using vibe coding. No manual frontend code was written — every component was generated through natural language prompts.

## Why It's a Project, Not Just a Website
The portfolio itself demonstrates the exact kind of AI systems I build professionally:
- A two-call logical tree routing agent (the AI chat)
- Production API with guardrails and rate limiting
- Content pipeline from markdown → GitHub → FastAPI → Next.js

The meta-story: a recruiter can ask "how does Rohith build AI systems?" and the AI will explain — from inside an AI system Rohith built.

## Technical Architecture

### AI Agent — Two-Call Logical Tree Routing
The AI chat avoids both the cost of sending everything and the inaccuracy of vector search:

**Call 1: Intent Router**
- Claude receives the user's query
- System prompt instructs it to return only a JSON list of nodes to fetch
- Example: `{"nodes": ["projects/codesage", "skills"]}`
- Fast, cheap, deterministic

**Call 2: Answer Generator**
- Claude receives: persona prompt + fetched markdown content + user query
- Responds in first-person as Rohith
- Streams the response to the frontend
- Only knows what's in the markdown files — can't fabricate

### Knowledge Base Structure (brain/ repo)
A private GitHub repository of markdown files:
```
brain/
├── about.md
├── skills.md
├── publications.md
├── experience/hdfc.md
├── experience/trianz.md
└── projects/codesage.md, nl-to-sql.md, agentic-learning.md, portfolio.md
```

Updating knowledge = editing a markdown file and pushing to GitHub. No redeployment needed.

### Frontend
- **Next.js 14** (App Router)
- **Framer Motion** for animations
- **Tailwind CSS** for styling
- Canvas-based neural network background on hero
- Contextual "Ask AI" chips throughout — click one, it pre-fills and sends the relevant question

### Backend
- **FastAPI** with streaming SSE responses
- **GitHub API** integration to fetch markdown content
- Guardrails: input sanitization, prompt injection detection, rate limiting (20 req/hour/IP)
- CORS configured for production domain only

### Build Process
Built entirely with Claude Code. The specification was a detailed prompt describing every section, component, and behavior. Claude Code generated all code — frontend components, backend services, API routes, prompt engineering, guardrails.

## Stack
- Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- FastAPI, Python, Anthropic SDK
- GitHub API
- Vercel (frontend), Railway (backend)
