'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAgent } from './AgentContext';

export default function AgentTrigger() {
  const [visible, setVisible] = useState(false);
  const [glowing, setGlowing] = useState(false);
  const { openAgent, isOpen } = useAgent();

  useEffect(() => {
    const handler = () => {
      if (window.scrollY > window.innerHeight * 0.6 && !visible) {
        setVisible(true);
      }
    };
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, [visible]);

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setGlowing(true), 900);
      return () => clearTimeout(t);
    }
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && !isOpen && (
        <motion.button
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80, transition: { duration: 0.2 } }}
          transition={{ type: 'spring', damping: 12, stiffness: 280 }}
          onClick={() => openAgent()}
          className={glowing ? 'trigger-glow-pulse' : ''}
          style={{
            position: 'fixed',
            bottom: '32px',
            right: '32px',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: '180px',
            height: '56px',
            padding: '0 18px',
            borderRadius: '28px',
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: glowing ? undefined : '0 0 24px rgba(124,58,237,0.5), 0 8px 32px rgba(0,0,0,0.4)',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Avatar */}
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: '0.7rem',
              fontWeight: 800,
              color: 'white',
              fontFamily: "'Bricolage Grotesque', sans-serif",
            }}
          >
            RD
          </div>

          {/* Text */}
          <div style={{ textAlign: 'left', flex: 1 }}>
            <p style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: '0.82rem',
              fontWeight: 700,
              color: 'white',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
            }}>
              Ask Rohith&apos;s AI
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
              <span className="pulse-dot" style={{ width: '5px', height: '5px', background: '#a7f3d0' }} />
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.62rem',
                color: 'rgba(255,255,255,0.75)',
              }}>
                Online
              </span>
            </div>
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
