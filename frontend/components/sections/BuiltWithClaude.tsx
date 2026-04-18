'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const cards = [
  {
    title: 'Logical Tree RAG',
    body: 'Rejected vector databases on first principles. Structured routing is faster, cheaper, and more accurate for known-schema content.',
    color: '#8b5cf6',
  },
  {
    title: 'Two-Call Agent Architecture',
    body: 'Intent router and persona synthesizer as separate concerns. Testable, debuggable, replaceable by design.',
    color: '#7c3aed',
  },
  {
    title: 'Prompt Engineering as Product',
    body: 'The router and persona prompts required more engineering judgment than any code in the system.',
    color: '#06b6d4',
  },
  {
    title: 'GitHub as Content Layer',
    body: 'No CMS. No database. Markdown + git push = live update. The simplest architecture that works.',
    color: '#22c55e',
  },
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
          <p className="section-label">META</p>
          <h2 className="section-title">This site is the proof of concept.</h2>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '1rem',
              color: '#8888aa',
              maxWidth: '520px',
              margin: '0 auto',
              lineHeight: 1.7,
            }}
          >
            Every architectural decision was made by a human engineer.
            <br />
            Claude Code handled the implementation.
            <br />
            <span style={{ color: '#c4b5fd', fontWeight: 600 }}>That&apos;s the skill.</span>
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-10">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.15 + i * 0.09 }}
              style={{
                padding: '20px 24px',
                background: `${card.color}08`,
                border: `1px solid ${card.color}22`,
                borderRadius: '12px',
              }}
            >
              <p style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: '0.95rem',
                fontWeight: 700,
                color: card.color,
                marginBottom: '8px',
              }}>
                {card.title}
              </p>
              <p style={{
                fontSize: '0.875rem',
                color: '#8888aa',
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1.65,
              }}>
                {card.body}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.55 }}
          className="text-center"
        >
          <a
            href="https://www.linkedin.com/in/rohith-dharavathu"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ display: 'inline-flex' }}
          >
            Read the architecture breakdown on LinkedIn →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
