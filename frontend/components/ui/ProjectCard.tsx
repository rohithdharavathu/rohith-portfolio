'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, X } from 'lucide-react';
import { useAgent } from '@/components/agent/AgentContext';

interface ProjectCardProps {
  name: string;
  description: string;
  longDescription: string;
  stack: string[];
  github?: string;
  aiQuestion: string;
  index: number;
  isInView: boolean;
}

export default function ProjectCard({
  name, description, longDescription, stack, github, aiQuestion, index, isInView,
}: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { openAgent } = useAgent();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="card-base card-top-border card-shimmer flex flex-col cursor-pointer"
        style={{ padding: '24px' }}
        onClick={() => setExpanded(true)}
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3
            style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: '1.1rem',
              fontWeight: 700,
              color: '#f8f8ff',
            }}
          >
            {name}
          </h3>
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              style={{ color: '#44445a', transition: 'color 0.2s', flexShrink: 0 }}
              onMouseEnter={(e) => ((e.currentTarget).style.color = '#8888aa')}
              onMouseLeave={(e) => ((e.currentTarget).style.color = '#44445a')}
            >
              <GitBranch size={15} />
            </a>
          )}
        </div>

        <p
          style={{
            fontSize: '0.875rem',
            color: '#8888aa',
            lineHeight: 1.65,
            marginBottom: '16px',
            flex: 1,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {stack.map((s) => <span key={s} className="tag">{s}</span>)}
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); openAgent(aiQuestion); }}
          className="chip self-start"
          style={{ fontSize: '0.72rem' }}
        >
          Ask AI about this →
        </button>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
            onClick={() => setExpanded(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="card-base w-full max-w-lg relative"
              style={{ padding: '28px', maxHeight: '80vh', overflowY: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Gradient top border */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', borderRadius: '14px 14px 0 0' }} />

              <button
                onClick={() => setExpanded(false)}
                className="absolute top-4 right-4"
                style={{ color: '#44445a', background: 'transparent', border: 'none', cursor: 'none' }}
              >
                <X size={18} />
              </button>

              <h3
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: '#f8f8ff',
                  marginBottom: '12px',
                  paddingRight: '2rem',
                }}
              >
                {name}
              </h3>

              <p
                style={{
                  fontSize: '0.9rem',
                  color: '#8888aa',
                  lineHeight: 1.75,
                  marginBottom: '20px',
                  fontFamily: "'Inter', sans-serif",
                  whiteSpace: 'pre-line',
                }}
              >
                {longDescription}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {stack.map((s) => <span key={s} className="tag">{s}</span>)}
              </div>

              <div className="flex gap-3">
                {github && (
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                  >
                    <GitBranch size={14} /> GitHub
                  </a>
                )}
                <button
                  onClick={() => { setExpanded(false); openAgent(aiQuestion); }}
                  className="chip"
                  style={{ padding: '0.5rem 1rem' }}
                >
                  Ask AI about this →
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
