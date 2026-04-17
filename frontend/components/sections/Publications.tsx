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

const typeColors: Record<string, string> = {
  IEEE: '#3b82f6',
  Springer: '#f59e0b',
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
          {publications.map((pub, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -24 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="card-base p-6"
            >
              <div className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 px-2.5 py-1 rounded text-xs font-bold"
                  style={{
                    background: `${typeColors[pub.type]}15`,
                    border: `1px solid ${typeColors[pub.type]}40`,
                    color: typeColors[pub.type],
                    fontFamily: "'Geist Mono', monospace",
                    marginTop: '2px',
                  }}
                >
                  {pub.type}
                </div>

                <div className="flex-1">
                  <h3
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: '1rem',
                      fontWeight: 600,
                      color: '#f0f0f0',
                      lineHeight: 1.4,
                      marginBottom: '0.5rem',
                    }}
                  >
                    {pub.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: '0.82rem',
                      color: '#808090',
                      marginBottom: '0.75rem',
                      lineHeight: 1.5,
                    }}
                  >
                    {pub.venue}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        fontFamily: "'Geist Mono', monospace",
                        fontSize: '0.75rem',
                        color: '#606070',
                      }}
                    >
                      {pub.year}
                    </span>
                    <a
                      href={pub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5"
                      style={{
                        fontSize: '0.78rem',
                        color: '#606070',
                        textDecoration: 'none',
                        fontFamily: "'Inter', sans-serif",
                        transition: 'color 0.2s',
                      }}
                      onMouseEnter={(e) => ((e.currentTarget).style.color = '#a0a0b0')}
                      onMouseLeave={(e) => ((e.currentTarget).style.color = '#606070')}
                    >
                      View Paper
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
