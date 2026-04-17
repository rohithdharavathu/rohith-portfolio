'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAgent } from './AgentContext';

export default function AgentTrigger() {
  const [visible, setVisible] = useState(false);
  const [hasAppeared, setHasAppeared] = useState(false);
  const { openAgent } = useAgent();

  useEffect(() => {
    const handler = () => {
      if (window.scrollY > window.innerHeight * 0.6 && !hasAppeared) {
        setVisible(true);
        setHasAppeared(true);
      }
    };
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, [hasAppeared]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: 'spring', damping: 20, stiffness: 260 }}
          onClick={() => openAgent()}
          className="rotating-border fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer"
          style={{
            background: '#111118',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            minWidth: '180px',
          }}
          whileHover={{ scale: 1.03, boxShadow: '0 12px 40px rgba(0,0,0,0.5), 0 0 24px rgba(124,58,237,0.2)' }}
          whileTap={{ scale: 0.97 }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
          >
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'white' }}>AI</span>
          </div>
          <div className="text-left">
            <p
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#f8f8ff',
                lineHeight: 1.2,
              }}
            >
              Ask Rohith&apos;s AI
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="pulse-dot" style={{ width: '5px', height: '5px' }} />
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '0.65rem',
                  color: '#22c55e',
                }}
              >
                Online
              </span>
            </div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
