'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import TimelineEntry from '@/components/ui/TimelineEntry';

const experiences = [
  {
    company: 'HDFC Bank',
    role: 'Data Scientist — WhatsApp Banking & Digital Journeys',
    period: 'Jan 2026 – Present',
    location: 'Mumbai, India',
    current: true,
    bullets: [
      'Built ML segmentation models across 40+ customer segments for behavioral targeting, reaching 10M+ monthly active WhatsApp Banking users.',
      'Designed and deployed end-to-end automation pipeline for segment selection, table preparation, and API request population — eliminating manual intervention and saving ~3 hours of daily operational effort.',
      'Developed fraud detection and risk scoring models using anomaly detection techniques; reduced false positive rate by 18%.',
      'Applied NLP and customer behavior analysis to drive personalization; improved campaign CTR by 22% via A/B testing and data-driven optimization.',
      'Built interactive Power BI dashboards tracking campaign KPIs, segmentation results, and operational metrics for senior stakeholders.',
    ],
    tags: ['Python', 'SQL', 'Scikit-learn', 'NLP', 'AWS', 'Power BI', 'REST APIs', 'A/B Testing', 'Feature Engineering', 'Statistical Modeling'],
    aiQuestion: 'What did Rohith build at HDFC Bank?',
    side: 'left' as const,
  },
  {
    company: 'Trianz',
    role: 'Software Product Engineer — Infrastructure, DevOps & AI',
    period: 'Jun 2022 – Jun 2023',
    location: 'Bengaluru, India',
    bullets: [
      'Built an Agentic AI adaptive learning system that personalized technical upskilling paths — won the internal hackathon.',
      'Worked on infrastructure automation and DevOps tooling across cloud environments (AWS, Azure).',
      'Integrated early ML/AI capabilities into internal product platforms, bridging the gap between data science and engineering.',
      'Contributed to CI/CD pipeline improvements and containerized deployment workflows using Docker and Kubernetes.',
    ],
    tags: ['Python', 'AWS', 'Docker', 'Kubernetes', 'AI/ML', 'DevOps', 'LangChain'],
    aiQuestion: 'What did Rohith build at Trianz?',
    side: 'right' as const,
  },
];

export default function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="experience" className="section-padding" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="section-label">Where I've Worked</p>
          <h2 className="section-title">Experience</h2>
          <div className="divider mx-auto" />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line - desktop only */}
          <div
            className="absolute hidden md:block"
            style={{
              left: '50%',
              transform: 'translateX(-50%)',
              top: 0,
              bottom: 0,
              width: '1px',
              background: 'linear-gradient(180deg, transparent, #3b82f6 10%, #06b6d4 90%, transparent)',
            }}
          />

          <div className="flex flex-col gap-12 md:gap-16">
            {experiences.map((exp, i) => (
              <div key={exp.company} className="md:relative block">
                {/* Mobile layout */}
                <div className="md:hidden">
                  <div className="card-base p-6">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.2rem' }}>
                          {exp.company}
                        </h3>
                        <p style={{ color: '#06b6d4', fontSize: '0.9rem', fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>
                          {exp.role}
                        </p>
                      </div>
                      {exp.current && (
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full flex-shrink-0"
                          style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', fontSize: '0.7rem', color: '#22c55e', fontFamily: "'Geist Mono', monospace" }}>
                          <span className="pulse-dot" style={{ width: '6px', height: '6px' }} />
                          Current
                        </span>
                      )}
                    </div>
                    <p style={{ fontFamily: "'Geist Mono', monospace", fontSize: '0.75rem', color: '#606070', marginBottom: '1rem' }}>
                      {exp.period} · {exp.location}
                    </p>
                    <ul className="flex flex-col gap-2 mb-4">
                      {exp.bullets.map((b, j) => (
                        <li key={j} className="flex gap-2" style={{ fontSize: '0.875rem', color: '#c0c0d0', fontFamily: "'Inter', sans-serif", lineHeight: 1.6 }}>
                          <span style={{ color: '#3b82f6', flexShrink: 0, marginTop: '0.2rem' }}>▸</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {exp.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
                    </div>
                  </div>
                </div>

                {/* Desktop layout */}
                <div className="hidden md:block">
                  <TimelineEntry {...exp} index={i} isInView={isInView} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
