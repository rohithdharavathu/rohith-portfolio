'use client';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import StatCard from '@/components/ui/StatCard';

const stats = [
  { value: '3', label: 'IEEE/Springer Publications', icon: '📄' },
  { value: '2+', label: 'Years in AI & ML', icon: '⚡' },
  { value: '5+', label: 'AI Systems Built', icon: '🤖' },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="about" className="section-padding" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label">Who I Am</p>
          <h2 className="section-title">About Me</h2>
          <div className="divider" />
        </motion.div>

        <div className="grid md:grid-cols-5 gap-12 items-start mt-8">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="md:col-span-2 flex flex-col items-center md:items-start gap-6"
          >
            <div className="relative">
              <div
                className="w-48 h-48 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #06b6d4, #8b5cf6)',
                  padding: '3px',
                }}
              >
                <div
                  className="w-full h-full rounded-full flex items-center justify-center"
                  style={{
                    background: '#1a1a24',
                    fontSize: '3.5rem',
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    color: '#3b82f6',
                  }}
                >
                  RD
                </div>
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 gap-3 w-full">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <StatCard {...stat} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Story */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-3"
          >
            <div className="flex flex-col gap-5" style={{ color: '#c0c0d0', fontFamily: "'Inter', sans-serif", lineHeight: 1.75 }}>
              <p>
                I&apos;m a Data Scientist at <span style={{ color: '#f0f0f0', fontWeight: 500 }}>HDFC Bank</span> working on the WhatsApp Banking & Digital Journeys team — building ML segmentation models, fraud detection systems, and data-driven pipelines that reach 10M+ monthly active users. I graduated from <span style={{ color: '#f0f0f0', fontWeight: 500 }}>Amrita Vishwa Vidyapeetham</span> with a B.Tech in Computer Science specializing in Artificial Intelligence.
              </p>
              <p>
                Before HDFC, I was at <span style={{ color: '#f0f0f0', fontWeight: 500 }}>Trianz</span> as a Software Product Engineer working across infrastructure, DevOps, and AI. Outside of work I built an Agentic AI adaptive learning system that won an internal hackathon — that project sparked my obsession with multi-agent architectures.
              </p>
              <p>
                I&apos;ve published <span style={{ color: '#06b6d4', fontWeight: 500 }}>three peer-reviewed papers</span> at IEEE and Springer conferences. My research spans NLP, computer vision, and applied ML. I believe the gap between a published model and a production system is where most interesting engineering happens.
              </p>
              <p>
                Right now, I&apos;m building <span style={{ color: '#3b82f6', fontWeight: 500 }}>CodeSage AI</span> — a GitHub-native codebase intelligence system that creates a live knowledge graph of any codebase using AST parsing and logical tree retrieval. No vector databases. No brute-force embedding search. Just structured reasoning over code.
              </p>
              <p style={{ color: '#a0a0b0', fontSize: '0.95rem' }}>
                I have a bias for <em style={{ color: '#c0c0d0' }}>doing over planning</em>. The best way to understand a system is to build one.
              </p>
            </div>

            {/* Links */}
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
