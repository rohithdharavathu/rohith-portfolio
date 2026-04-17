'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Cpu } from 'lucide-react';
import NeuralBackground from '@/components/ui/NeuralBackground';
import { useAgent } from '@/components/agent/AgentContext';

const subtitles = ['Data Scientist', 'ML Engineer', 'GenAI Builder', 'CodeSage Creator'];

export default function Hero() {
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const { openAgent } = useAgent();

  useEffect(() => {
    const interval = setInterval(() => {
      setSubtitleIndex((i) => (i + 1) % subtitles.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative flex items-center justify-center overflow-hidden"
      style={{ minHeight: '100vh' }}
    >
      <NeuralBackground />

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(59,130,246,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 section-container text-center flex flex-col items-center" style={{ paddingTop: '80px' }}>
        {/* AI tag */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full"
          style={{
            background: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            fontSize: '0.78rem',
            color: '#a0a0b0',
            fontFamily: "'Geist Mono', monospace",
          }}
        >
          <Cpu size={12} style={{ color: '#3b82f6' }} />
          AI-powered — ask me anything
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          style={{
            fontSize: 'clamp(3rem, 8vw, 6.5rem)',
            fontWeight: 800,
            fontFamily: "'Syne', sans-serif",
            color: '#ffffff',
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            marginBottom: '0.5rem',
          }}
        >
          Rohith
          <br />
          <span className="gradient-text">Dharavathu</span>
        </motion.h1>

        {/* Rotating subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-3 mb-6"
          style={{ height: '2.5rem' }}
        >
          <span style={{ color: '#404050', fontSize: '1.1rem' }}>—</span>
          <div style={{ width: '220px', textAlign: 'left' }}>
            <AnimatePresence mode="wait">
              <motion.span
                key={subtitleIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: '#06b6d4',
                  display: 'block',
                }}
              >
                {subtitles[subtitleIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
          <span style={{ color: '#404050', fontSize: '1.1rem' }}>—</span>
        </motion.div>

        {/* Pitch */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: '#a0a0b0',
            maxWidth: '520px',
            marginBottom: '2.5rem',
            lineHeight: 1.6,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 400,
          }}
        >
          I build AI systems that think, not just predict.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex flex-wrap gap-3 justify-center"
        >
          <button
            onClick={() => scrollTo('#projects')}
            className="btn-primary"
          >
            View My Work
            <ArrowDown size={16} />
          </button>
          <button
            onClick={() => { scrollTo('#agent'); openAgent(); }}
            className="btn-secondary flex items-center gap-2"
          >
            <span className="pulse-dot" />
            Talk to AI
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-8 flex flex-col items-center gap-2"
          style={{ color: '#404050' }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <ArrowDown size={16} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
