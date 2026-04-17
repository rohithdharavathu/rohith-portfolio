'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ExternalLink } from 'lucide-react';

const publications = [
  {
    title: 'Deep Learning-Based Approaches for Text Classification in NLP: A Comparative Study',
    venue: 'IEEE International Conference on Electronics, Computing and Communication Technologies',
    year: '2023',
    type: 'IEEE',
    link: '#',
  },
  {
    title: 'Intelligent Adaptive Learning Systems Using Reinforcement Learning and Knowledge Graphs',
    venue: 'Springer International Conference on Intelligent Computing and Applications',
    year: '2023',
    type: 'Springer',
    link: '#',
  },
  {
    title: 'Conversational AI for Financial Services: Intent Recognition and Slot Filling with Transformer Models',
    venue: 'IEEE Conference on Computational Intelligence and Applications',
    year: '2024',
    type: 'IEEE',
    link: '#',
  },
];

const typeColors: Record<string, { color: string; bg: string; border: string }> = {
  IEEE: { color: '#06b6d4', bg: 'rgba(6,182,212,0.08)', border: 'rgba(6,182,212,0.25)' },
  Springer: { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)' },
};

export default function Publications() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="publications" className="section-padding" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="section-label">Research</p>
          <h2 className="section-title">Publications</h2>
          <div className="divider mx-auto" />
        </motion.div>

        <div className="flex flex-col gap-4 max-w-3xl mx-auto">
          {publications.map((pub, i) => {
            const tc = typeColors[pub.type] ?? { color: '#8888aa', bg: 'rgba(136,136,170,0.08)', border: 'rgba(136,136,170,0.25)' };
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -24 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="card-base card-top-border"
                style={{ padding: '24px' }}
              >
                <div className="flex items-start gap-4">
                  {/* Year — prominent */}
                  <div
                    className="flex-shrink-0 flex flex-col items-center justify-center rounded-xl"
                    style={{
                      width: '56px',
                      minWidth: '56px',
                      background: 'rgba(124,58,237,0.08)',
                      border: '1px solid rgba(124,58,237,0.2)',
                      padding: '10px 0',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        fontSize: '1.1rem',
                        fontWeight: 800,
                        color: '#7c3aed',
                        lineHeight: 1,
                      }}
                    >
                      {pub.year}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Badge */}
                    <span
                      style={{
                        display: 'inline-block',
                        background: tc.bg,
                        border: `1px solid ${tc.border}`,
                        color: tc.color,
                        fontFamily: "'DM Mono', monospace",
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase' as const,
                        padding: '3px 10px',
                        borderRadius: '999px',
                        marginBottom: '10px',
                      }}
                    >
                      {pub.type}
                    </span>

                    <h3
                      style={{
                        fontFamily: "'Bricolage Grotesque', sans-serif",
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: '#f8f8ff',
                        lineHeight: 1.45,
                        marginBottom: '0.5rem',
                      }}
                    >
                      {pub.title}
                    </h3>

                    <p
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: '0.82rem',
                        color: '#8888aa',
                        marginBottom: '14px',
                        lineHeight: 1.5,
                      }}
                    >
                      {pub.venue}
                    </p>

                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5"
                      style={{
                        fontSize: '0.78rem',
                        color: '#44445a',
                        textDecoration: 'none',
                        fontFamily: "'Inter', sans-serif",
                        transition: 'color 0.2s',
                        width: 'fit-content',
                      }}
                      onMouseEnter={(e) => ((e.currentTarget).style.color = '#8888aa')}
                      onMouseLeave={(e) => ((e.currentTarget).style.color = '#44445a')}
                    >
                      View Paper <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
