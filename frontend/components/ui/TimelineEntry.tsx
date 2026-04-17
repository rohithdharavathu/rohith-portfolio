'use client';
import { motion } from 'framer-motion';
import { useAgent } from '@/components/agent/AgentContext';

interface TimelineEntryProps {
  company: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
  tags: string[];
  current?: boolean;
  side: 'left' | 'right';
  index: number;
  isInView: boolean;
  aiQuestion: string;
}

export default function TimelineEntry({
  company, role, period, location, bullets, tags,
  current, side, index, isInView, aiQuestion,
}: TimelineEntryProps) {
  const { openAgent } = useAgent();

  return (
    <motion.div
      initial={{ opacity: 0, x: side === 'left' ? -48 : 48, y: 20 }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.18 }}
      className="relative flex"
      style={{
        justifyContent: side === 'left' ? 'flex-end' : 'flex-start',
        width: 'calc(50% - 2.5rem)',
        marginLeft: side === 'right' ? 'calc(50% + 2.5rem)' : 0,
      }}
    >
      {/* Gradient node dot */}
      <div
        className="absolute hidden md:flex items-center justify-center"
        style={{
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
          boxShadow: '0 0 16px rgba(124,58,237,0.6)',
          top: '1.75rem',
          [side === 'left' ? 'right' : 'left']: '-2.75rem',
          transform: 'translate(50%, 0)',
          zIndex: 2,
        }}
      />

      <div
        className="card-base card-top-border"
        style={{ padding: '24px', maxWidth: '480px', width: '100%' }}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#f8f8ff',
                marginBottom: '0.3rem',
              }}
            >
              {company}
            </h3>
            <p style={{ color: '#06b6d4', fontSize: '0.88rem', fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>
              {role}
            </p>
          </div>
          {current && (
            <span
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full flex-shrink-0"
              style={{
                background: 'rgba(34,197,94,0.09)',
                border: '1px solid rgba(34,197,94,0.28)',
                fontSize: '0.68rem',
                color: '#22c55e',
                fontFamily: "'DM Mono', monospace",
              }}
            >
              <span className="pulse-dot" style={{ width: '6px', height: '6px' }} />
              Current
            </span>
          )}
        </div>

        <p
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.72rem',
            color: '#44445a',
            marginBottom: '16px',
          }}
        >
          {period} · {location}
        </p>

        <ul className="flex flex-col gap-3 mb-5">
          {bullets.map((b, i) => (
            <li
              key={i}
              className="flex gap-2.5"
              style={{
                fontSize: '0.875rem',
                color: '#8888aa',
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1.65,
              }}
            >
              <span style={{ color: '#7c3aed', flexShrink: 0, marginTop: '0.25rem' }}>▸</span>
              {b}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
        </div>

        <button onClick={() => openAgent(aiQuestion)} className="chip">
          Ask AI about my work here →
        </button>
      </div>
    </motion.div>
  );
}
