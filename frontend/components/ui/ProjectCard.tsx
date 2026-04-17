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
        initial={{ opacity: 0, y: 32 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="card-base p-6 flex flex-col cursor-pointer"
        onClick={() => setExpanded(true)}
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: '1.05rem',
              fontWeight: 700,
              color: '#ffffff',
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
              style={{ color: '#606070', transition: 'color 0.2s' }}
              onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = '#a0a0b0')}
              onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = '#606070')}
            >
              <GitBranch size={16} />
            </a>
          )}
        </div>

        <p
          style={{
            fontSize: '0.875rem',
            color: '#a0a0b0',
            lineHeight: 1.6,
            marginBottom: '1rem',
            flex: 1,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
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
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
            onClick={() => setExpanded(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="card-base p-8 w-full max-w-lg relative"
              style={{ maxHeight: '80vh', overflowY: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setExpanded(false)}
                className="absolute top-4 right-4"
                style={{ color: '#606070', background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>

              <h3
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '1.4rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  marginBottom: '0.75rem',
                }}
              >
                {name}
              </h3>

              <p
                style={{
                  fontSize: '0.9rem',
                  color: '#c0c0d0',
                  lineHeight: 1.75,
                  marginBottom: '1.5rem',
                  fontFamily: "'Inter', sans-serif",
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
                    <GitBranch size={14} />
                    GitHub
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
