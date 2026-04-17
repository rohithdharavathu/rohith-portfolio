'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const points = [
  'Every component was generated through natural language prompts — no manual frontend coding.',
  'The AI agent architecture (two-call logical tree routing) was designed and implemented entirely in Claude Code.',
  'Content lives in markdown files in a private GitHub repo — update the markdown, update the AI.',
  "The meta-point: this portfolio demonstrates exactly the kind of AI-native systems Rohith builds professionally.",
];

const flowNodes = [
  { label: 'brain/', sublabel: 'Markdown files', color: '#8b5cf6' },
  { label: 'GitHub API', sublabel: 'Content delivery', color: '#3b82f6' },
  { label: 'FastAPI', sublabel: 'Backend router', color: '#06b6d4' },
  { label: 'Claude API', sublabel: 'Two-call agent', color: '#22c55e' },
  { label: 'Next.js', sublabel: 'Frontend', color: '#f59e0b' },
];

export default function BuiltWithClaude() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="meta"
      ref={ref}
      style={{
        background: '#080810',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '5rem 0',
      }}
    >
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="section-label">Meta</p>
          <h2 className="section-title">This site was built entirely with Claude Code.</h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '1rem',
              color: '#a0a0b0',
              maxWidth: '480px',
              margin: '0 auto',
            }}
          >
            No manual frontend code. Just intent, prompts, and vibe coding.
          </p>
        </motion.div>

        {/* Architecture diagram */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-12"
        >
          {flowNodes.map((node, i) => (
            <div key={node.label} className="flex items-center gap-2">
              <div
                className="px-4 py-3 rounded-xl text-center"
                style={{
                  background: `${node.color}10`,
                  border: `1px solid ${node.color}30`,
                  minWidth: '100px',
                }}
              >
                <p
                  style={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: node.color,
                    marginBottom: '0.2rem',
                  }}
                >
                  {node.label}
                </p>
                <p style={{ fontSize: '0.65rem', color: '#606070', fontFamily: "'Inter', sans-serif" }}>
                  {node.sublabel}
                </p>
              </div>
              {i < flowNodes.length - 1 && (
                <span style={{ color: '#333344', fontSize: '0.9rem' }}>→</span>
              )}
            </div>
          ))}
        </motion.div>

        {/* Points */}
        <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-10">
          {points.map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
              className="flex gap-3"
              style={{
                padding: '1rem 1.25rem',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '10px',
              }}
            >
              <span style={{ color: '#3b82f6', flexShrink: 0, marginTop: '2px' }}>▸</span>
              <p style={{ fontSize: '0.875rem', color: '#c0c0d0', fontFamily: "'Inter', sans-serif", lineHeight: 1.6 }}>
                {point}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <a
            href="#"
            className="btn-secondary"
            style={{ display: 'inline-flex' }}
          >
            Read the build thread on LinkedIn →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
