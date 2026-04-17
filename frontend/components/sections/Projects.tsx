'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import ProjectCard from '@/components/ui/ProjectCard';

const projects = [
  {
    name: 'CodeSage AI',
    description: 'GitHub-native codebase intelligence system. Live code knowledge graph via tree-sitter AST parsing. Logical tree retrieval — no vector DB.',
    longDescription: `CodeSage AI is a GitHub-native codebase intelligence system that goes significantly beyond basic RAG. It builds a live code knowledge graph using tree-sitter for AST parsing, enabling structural understanding of any codebase.

Core capabilities: persistent multi-agent workflows, logical tree-based retrieval (no vector database required), function dependency analysis, architectural pattern detection, and change impact analysis.

The system can answer deep questions about any codebase — what calls what, what changed where, what breaks if you modify X. Phase 1 (current) covers AST parsing and the graph core.`,
    stack: ['Python', 'tree-sitter', 'FastAPI', 'Claude API', 'GitHub API', 'NetworkX'],
    aiQuestion: 'Tell me about CodeSage AI — how does it work technically?',
    github: 'https://github.com/rohithdharavathu',
  },
  {
    name: 'NL-to-SQL Engine',
    description: 'Production NL-to-SQL pipeline. Chain-of-thought planner, LLM validator with retry logic, keyword-based schema retriever.',
    longDescription: `A production-ready natural language to SQL pipeline built with Python, DuckDB, and the Claude API.

Four core modules: schema extractor, SQL generator, executor, and main pipeline orchestrator. Additional features: chain-of-thought planning module that reasons through query intent before generating SQL, LLM-based PASS/FAIL validator with automatic retry logic on failure, and a keyword-based schema retriever that filters relevant tables from large schemas.

Handles ambiguous natural language queries, validates output before execution, and retries with error context on failure. A personal project built to explore the full complexity of making NL-to-SQL actually reliable.`,
    stack: ['Python', 'DuckDB', 'Claude API', 'FastAPI', 'SQLAlchemy'],
    aiQuestion: "How does Rohith's NL-to-SQL engine work?",
    github: 'https://github.com/rohithdharavathu',
  },
  {
    name: 'Agentic Learning System',
    description: 'Adaptive AI learning platform that personalizes technical upskilling paths. Personal project — won an internal hackathon when presented.',
    longDescription: `A personal project: an adaptive AI learning system that personalizes technical upskilling paths for engineers. The system uses agentic workflows to assess current skill levels, identify gaps, generate personalized learning plans, and adapt based on progress.

Built out of genuine curiosity about multi-agent systems — and ended up winning an internal hackathon when I presented it. The key insight: a single LLM call isn't intelligent; a workflow of specialized agents making decisions at each step is.`,
    stack: ['Python', 'LangChain', 'FastAPI', 'React', 'PostgreSQL'],
    aiQuestion: "Tell me about Rohith's Agentic Learning System",
    github: 'https://github.com/rohithdharavathu',
  },
  {
    name: 'This Portfolio',
    description: 'AI-native portfolio with logical tree RAG, Claude agent in first-person voice, built entirely with Claude Code. Meta.',
    longDescription: `This portfolio is itself a project. Built entirely with Claude Code using vibe coding — no manual frontend code, just intent and prompts.

The AI agent uses a two-call logical tree routing architecture: Call 1 routes the query to relevant knowledge files; Call 2 generates a response in first-person voice using only those files. No vector database — pure structural retrieval.

The "brain" is a private GitHub repository of markdown files that powers every AI response. Update a markdown file, push to GitHub, and the AI's knowledge updates instantly. The meta-story: a portfolio that demonstrates exactly the kind of AI systems Rohith builds.`,
    stack: ['Next.js 14', 'FastAPI', 'Claude API', 'Framer Motion', 'Tailwind', 'GitHub API'],
    aiQuestion: 'How was this portfolio built? Tell me about the AI architecture.',
    github: 'https://github.com/rohithdharavathu',
  },
];

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="projects" className="section-padding" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="section-label">What I've Built</p>
          <h2 className="section-title">Projects</h2>
          <div className="divider mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-5">
          {projects.map((project, i) => (
            <ProjectCard key={project.name} {...project} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}
