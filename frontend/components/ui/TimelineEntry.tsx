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
      initial={{ opacity: 0, x: side === 'left' ? -48 : 48 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className={`relative flex ${side === 'left' ? 'md:justify-end' : 'md:justify-start'} justify-start`}
      style={{ width: 'calc(50% - 2rem)', marginLeft: side === 'right' ? 'calc(50% + 2rem)' : 0 }}
    >
      {/* Connector dot */}
      <div
        className="absolute hidden md:block"
        style={{
          width: '14px',
          height: '14px',
          borderRadius: '50%',
          background: current ? '#22c55e' : '#3b82f6',
          boxShadow: `0 0 12px ${current ? '#22c55e' : '#3b82f6'}60`,
          top: '1.5rem',
          [side === 'left' ? 'right' : 'left']: '-2.5rem',
          transform: 'translate(50%, 0)',
        }}
      />

      <div
        className="card-base p-6 w-full"
        style={{ maxWidth: '480px' }}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h3
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '1.2rem',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '0.2rem',
              }}
            >
              {company}
            </h3>
            <p style={{ color: '#06b6d4', fontSize: '0.9rem', fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>
              {role}
            </p>
          </div>
          {current && (
            <span
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full flex-shrink-0"
              style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                fontSize: '0.7rem',
                color: '#22c55e',
                fontFamily: "'Geist Mono', monospace",
              }}
            >
              <span className="pulse-dot" style={{ width: '6px', height: '6px' }} />
              Current
            </span>
          )}
        </div>

        <p
          style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: '0.75rem',
            color: '#606070',
            marginBottom: '1rem',
          }}
        >
          {period} · {location}
        </p>

        <ul className="flex flex-col gap-2 mb-4">
          {bullets.map((b, i) => (
            <li
              key={i}
              className="flex gap-2"
              style={{
                fontSize: '0.875rem',
                color: '#c0c0d0',
                fontFamily: "'Inter', sans-serif",
                lineHeight: 1.6,
              }}
            >
              <span style={{ color: '#3b82f6', flexShrink: 0, marginTop: '0.2rem' }}>▸</span>
              {b}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>

        <button
          onClick={() => openAgent(aiQuestion)}
          className="chip"
        >
          Ask AI about my work here →
        </button>
      </div>
    </motion.div>
  );
}
