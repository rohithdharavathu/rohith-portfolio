'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Cpu } from 'lucide-react';
import NeuralBackground from '@/components/ui/NeuralBackground';
import { useAgent } from '@/components/agent/AgentContext';

const subtitles = ['Data Scientist', 'ML Engineer', 'GenAI Builder', 'CodeSage Creator'];
const FIRST = 'Rohith';
const LAST = 'Dharavathu';

const letterVariants = {
  hidden: { opacity: 0, filter: 'blur(12px)', y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: { delay: 0.4 + i * 0.055, duration: 0.55, ease: 'easeOut' as const },
  }),
};

function AnimatedWord({ word, startDelay = 0, color }: { word: string; startDelay?: number; color?: string }) {
  return (
    <span style={{ display: 'inline-block' }}>
      {word.split('').map((ch, i) => (
        <motion.span
          key={i}
          custom={i + startDelay}
          variants={letterVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'inline-block', whiteSpace: 'pre', ...(color ? { color } : {}) }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  );
}

export default function Hero() {
  const [subtitleIndex, setSubtitleIndex] = useState(0);
  const { openAgent } = useAgent();

  useEffect(() => {
    const t = setInterval(() => setSubtitleIndex((i) => (i + 1) % subtitles.length), 2600);
    return () => clearInterval(t);
  }, []);

  const scrollTo = (id: string) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section
      id="hero"
      className="relative flex items-center justify-center overflow-hidden"
      style={{ minHeight: '100vh' }}
    >
      <NeuralBackground />

      {/* Subtle CSS grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(124,58,237,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.03) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
        }}
      />

      {/* Glow orb behind name */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '700px',
          height: '420px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -56%)',
          background: 'radial-gradient(ellipse at center, rgba(124,58,237,0.18) 0%, rgba(6,182,212,0.08) 50%, transparent 75%)',
          filter: 'blur(40px)',
        }}
      />

      <div
        className="relative z-10 section-container text-center flex flex-col items-center"
        style={{ paddingTop: '80px' }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full"
          style={{
            background: 'rgba(124,58,237,0.08)',
            border: '1px solid rgba(124,58,237,0.22)',
            fontSize: '0.75rem',
            color: '#a78bfa',
            fontFamily: "'DM Mono', monospace",
          }}
        >
          <Cpu size={11} style={{ color: '#7c3aed' }} />
          AI-powered — ask me anything
        </motion.div>

        {/* Name — letter blur-in */}
        <h1
          style={{
            fontSize: 'clamp(2.8rem, 10vw, 7rem)',
            fontWeight: 800,
            fontFamily: "'Bricolage Grotesque', sans-serif",
            letterSpacing: '-0.025em',
            lineHeight: 1.0,
            marginBottom: '0.4rem',
          }}
        >
          <AnimatedWord word={FIRST} startDelay={0} />
          <br />
          <AnimatedWord word={LAST} startDelay={FIRST.length + 2} color="#c4b5fd" />
        </h1>

        {/* Rotating subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="flex items-center justify-center gap-3 mb-6 mt-3"
          style={{ height: '2.2rem' }}
        >
          <span style={{ color: '#2a2a3a', fontSize: '1rem' }}>—</span>
          <div style={{ width: '200px', textAlign: 'center' }}>
            <AnimatePresence mode="wait">
              <motion.span
                key={subtitleIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28 }}
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: '#06b6d4',
                  display: 'block',
                }}
              >
                {subtitles[subtitleIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
          <span style={{ color: '#2a2a3a', fontSize: '1rem' }}>—</span>
        </motion.div>

        {/* Pitch */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          style={{
            fontSize: 'clamp(1rem, 2.2vw, 1.2rem)',
            color: '#8888aa',
            maxWidth: '500px',
            marginBottom: '2.5rem',
            lineHeight: 1.65,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          I build AI systems that think, not just predict.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="flex flex-wrap gap-3 justify-center"
        >
          <button onClick={() => scrollTo('#projects')} className="btn-primary">
            View My Work
            <ArrowDown size={15} />
          </button>
          <button
            onClick={() => { scrollTo('#agent'); openAgent(); }}
            className="btn-secondary flex items-center gap-2"
          >
            <span className="pulse-dot" />
            Talk to AI
          </button>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.9 }}
          className="absolute bottom-8 flex flex-col items-center gap-2"
          style={{ color: '#2a2a40' }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <ArrowDown size={15} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
