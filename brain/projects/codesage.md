# CodeSage AI

## What It Is
CodeSage AI is a personal project — a GitHub-native codebase intelligence system built out of curiosity about what real code understanding could look like. It goes significantly beyond basic RAG by treating code structurally rather than as plain text.

## The Problem It Solves
Existing code AI tools treat code as text. They do well at autocompletion but poorly at understanding system architecture, cross-file dependencies, and impact analysis. CodeSage is designed for questions like:
- "What functions call this method?"
- "If I change this data structure, what breaks?"
- "What's the architectural pattern in this module?"
- "Explain how the authentication flow works across these five files."

## Technical Architecture

### Live Code Knowledge Graph
- Uses **tree-sitter** for AST (Abstract Syntax Tree) parsing across multiple languages
- Builds a graph where nodes are code entities (functions, classes, modules, variables) and edges are relationships (calls, imports, extends, uses)
- Graph stored in memory using **NetworkX** for fast traversal
- Rebuilt on each analysis or incrementally updated on git changes

### Logical Tree Retrieval
Instead of vector similarity search, CodeSage uses logical tree retrieval:
- Parses the query to understand what structural information is needed
- Traverses the knowledge graph to fetch precisely relevant nodes
- Returns structured context rather than approximate nearest neighbors
- More precise for code analysis than embedding-based approaches

### Persistent Multi-Agent Workflows
- **Orchestrator Agent**: Understands the user's question and plans the analysis
- **Parser Agent**: Handles AST parsing and graph construction
- **Retrieval Agent**: Traverses the knowledge graph for relevant context
- **Answer Agent**: Synthesizes findings into clear explanations

### Stack
- **Python** — core engine
- **tree-sitter** — AST parsing (supports Python, JS, TypeScript, Go, Rust, more)
- **FastAPI** — backend API
- **Claude API** — LLM for all agent reasoning
- **GitHub API** — repository access and file fetching
- **NetworkX** — knowledge graph data structures

## Current Status
Phase 1 (current): AST parsing engine and graph core. Parsing Python and JavaScript codebases, building the knowledge graph, basic traversal queries.

Phase 2 (planned): Multi-agent orchestration layer, persistent workflows, natural language query interface.

## Why I Built It
I wanted to understand whether code could be reasoned about structurally rather than semantically. The knowledge graph approach means the system can answer architectural questions that pure embedding search cannot. It's a personal exploration into what real code intelligence looks like — not just autocomplete.
