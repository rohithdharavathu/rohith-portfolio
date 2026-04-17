'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import AgentPanel from '@/components/agent/AgentPanel';
import { useAgent } from '@/components/agent/AgentContext';

const SUGGESTED = [
  "What has Rohith built in GenAI?",
  "How does CodeSage work?",
  "What does Rohith do at HDFC Bank?",
];

export default function AgentSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const { openAgent } = useAgent();

  return (
    <section id="agent" className="section-padding" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <p className="section-label">AI Representative</p>
          <h2 className="section-title">Have questions? I built an AI that answers as me.</h2>
          <p
            style={{
              color: '#a0a0b0',
              fontFamily: "'Inter', sans-serif",
              maxWidth: '520px',
              margin: '0 auto 2rem',
              fontSize: '1rem',
              lineHeight: 1.6,
            }}
          >
            Trained on my projects, experience, and thinking. Ask anything professional.
          </p>
          <div className="divider mx-auto" />
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center mt-10">
          {/* Suggested chips */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-3 lg:w-56 w-full"
          >
            <p
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: '0.72rem',
                color: '#606070',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '0.25rem',
              }}
            >
              Try asking:
            </p>
            {SUGGESTED.map((q) => (
              <button
                key={q}
                className="text-left px-4 py-3 rounded-xl text-sm transition-all duration-200"
                style={{
                  background: 'rgba(59,130,246,0.06)',
                  border: '1px solid rgba(59,130,246,0.15)',
                  color: '#c0c0d0',
                  fontFamily: "'Inter', sans-serif",
                  cursor: 'pointer',
                  lineHeight: 1.4,
                }}
                onClick={() => openAgent(q)}
                onMouseEnter={(e) => {
                  (e.currentTarget).style.background = 'rgba(59,130,246,0.12)';
                  (e.currentTarget).style.borderColor = 'rgba(59,130,246,0.3)';
                  (e.currentTarget).style.color = '#f0f0f0';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget).style.background = 'rgba(59,130,246,0.06)';
                  (e.currentTarget).style.borderColor = 'rgba(59,130,246,0.15)';
                  (e.currentTarget).style.color = '#c0c0d0';
                }}
              >
                &ldquo;{q}&rdquo;
              </button>
            ))}

            <div
              className="mt-4 p-3 rounded-xl"
              style={{
                background: 'rgba(34,197,94,0.05)',
                border: '1px solid rgba(34,197,94,0.15)',
              }}
            >
              <p style={{ fontSize: '0.72rem', color: '#404050', fontFamily: "'Geist Mono', monospace", lineHeight: 1.5 }}>
                Powered by Claude + logical tree RAG over markdown knowledge files.
              </p>
            </div>
          </motion.div>

          {/* Agent panel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex-1 flex justify-center"
          >
            <AgentPanel />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
