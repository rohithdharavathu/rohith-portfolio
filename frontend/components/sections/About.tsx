'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import StatCard from '@/components/ui/StatCard';

const stats = [
  { value: '3', label: 'IEEE/Springer Publications', icon: '📄' },
  { value: '2+', label: 'Years in AI & ML', icon: '⚡' },
  { value: '5+', label: 'AI Systems Built', icon: '🤖' },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const fade = (delay = 0) => ({
    initial: { opacity: 0, y: 40 },
    animate: isInView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.7, delay },
  });

  return (
    <section id="about" className="section-padding" ref={ref}>
      <div className="section-container">
        <motion.div {...fade()} >
          <p className="section-label">Who I Am</p>
          <h2 className="section-title">About Me</h2>
          <div className="divider" />
        </motion.div>

        <div className="grid md:grid-cols-5 gap-12 items-start mt-8">
          {/* Left — avatar + stats */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="md:col-span-2 flex flex-col items-center md:items-start gap-6"
          >
            {/* Animated ring avatar */}
            <div className="avatar-ring-outer">
              <div className="avatar-inner">
                <div
                  className="w-44 h-44 rounded-full flex items-center justify-center"
                  style={{
                    background: '#0f0f1a',
                    fontSize: '3rem',
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    fontWeight: 800,
                    color: '#7c3aed',
                  }}
                >
                  RD
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 w-full">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.35 + i * 0.1 }}
                >
                  <StatCard {...stat} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — story */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.22 }}
            className="md:col-span-3"
          >
            <div className="flex flex-col gap-5" style={{ color: '#8888aa', fontFamily: "'Inter', sans-serif", lineHeight: 1.8 }}>
              <p>
                I&apos;m a Data Scientist at{' '}
                <span style={{ color: '#f8f8ff', fontWeight: 500 }}>HDFC Bank</span> on the WhatsApp Banking & Digital Journeys team — building ML segmentation models, fraud detection systems, and data-driven pipelines reaching{' '}
                <span style={{ color: '#a78bfa', fontWeight: 500 }}>10M+ monthly active users</span>. I graduated from{' '}
                <span style={{ color: '#f8f8ff', fontWeight: 500 }}>Amrita Vishwa Vidyapeetham</span> with a B.Tech in Computer Science specializing in AI.
              </p>
              <p>
                Before HDFC, I was at{' '}
                <span style={{ color: '#f8f8ff', fontWeight: 500 }}>Trianz</span> as a Software Product Engineer across infrastructure, DevOps, and AI. Outside work I built an Agentic AI adaptive learning system that won an internal hackathon — that project sparked my obsession with multi-agent architectures.
              </p>
              <p>
                I&apos;ve published{' '}
                <span style={{ color: '#06b6d4', fontWeight: 500 }}>three peer-reviewed papers</span> at IEEE and Springer. I believe the gap between a published model and a production system is where the most interesting engineering happens.
              </p>
              <p>
                Right now I&apos;m building{' '}
                <span style={{ color: '#a78bfa', fontWeight: 500 }}>CodeSage AI</span> — a GitHub-native codebase intelligence system with a live knowledge graph using AST parsing and logical tree retrieval. No vector databases. Just structured reasoning over code.
              </p>
              <p style={{ color: '#44445a', fontSize: '0.92rem' }}>
                Bias for <em style={{ color: '#6666aa', fontStyle: 'italic' }}>doing over planning</em>. The best way to understand a system is to build one.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mt-8">
              {[
                { label: 'GitHub', href: 'https://github.com/rohithdharavathu' },
                { label: 'LinkedIn', href: '#' },
                { label: 'Google Scholar', href: '#' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                >
                  {link.label} ↗
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
