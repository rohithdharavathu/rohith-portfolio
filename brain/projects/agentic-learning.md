# Agentic Learning System

## What It Is
A personal project — an adaptive AI learning platform that personalizes technical upskilling paths for engineers. Built out of genuine curiosity about multi-agent systems, and ended up winning an internal hackathon when I presented it.

## The Problem
Generic learning platforms give everyone the same content. A senior engineer and a junior engineer don't need the same learning path. I wanted to build something that assesses where someone actually is, identifies the specific gaps, and generates a genuinely personalized plan — not just "here's the beginner/intermediate/advanced track."

## Architecture

### Multi-Agent Design
Four specialized agents in a coordinated workflow:

**Assessment Agent**
- Conducts conversational skill assessments
- Asks targeted questions to identify knowledge gaps
- Updates a skills profile based on responses
- Distinguishes between surface familiarity and genuine expertise

**Planning Agent**
- Takes the skills profile and career goals as input
- Uses a knowledge graph of skill dependencies to identify the optimal learning sequence
- Generates a week-by-week learning plan with milestones
- Adapts the plan as the learner progresses

**Content Curation Agent**
- Maps learning objectives to specific resources (courses, docs, tutorials, projects)
- Prioritizes hands-on projects over passive consumption

**Progress Agent**
- Monitors completion and assessment signals
- Triggers plan revisions when a learner is ahead or struggling

### Knowledge Graph
A graph of technical skills and their dependencies — nodes are individual skills, edges are prerequisite relationships. Used by the Planning Agent to sequence learning correctly.

## Why I Built It
I built this as a personal project out of curiosity about multi-agent architectures. The key insight I was exploring: a single LLM call gives you a good answer. A workflow of specialized agents making decisions at each step gives you a system. When I presented it at an internal hackathon, it won — but it was fundamentally a personal exploration, not a work project.

## Stack
- Python, LangChain (early version)
- FastAPI backend
- React frontend
- PostgreSQL for learner state
