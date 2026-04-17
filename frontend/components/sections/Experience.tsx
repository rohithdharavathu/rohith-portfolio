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
    tags: ['Python', 'SQL', 'Scikit-learn', 'NLP', 'AWS', 'Power BI', 'REST APIs', 'A/B Testing', 'Feature Engineering'],
    aiQuestion: 'What did Rohith build at HDFC Bank?',
    side: 'left' as const,
  },
  {
    company: 'Trianz',
    role: 'Software Product Engineer — Infrastructure, DevOps & AI',
    period: 'Jun 2022 – Jun 2023',
    location: 'Bengaluru, India',
    bullets: [
      'Worked on infrastructure automation and DevOps tooling across AWS and Azure cloud environments.',
      'Built CI/CD pipeline improvements using GitHub Actions; containerized deployments with Docker and Kubernetes.',
      'Integrated ML/AI capabilities into internal product platforms, bridging data science and engineering.',
      'Built an Agentic AI adaptive learning system as a personal project — won the internal hackathon.',
    ],
    tags: ['Python', 'AWS', 'Docker', 'Kubernetes', 'CI/CD', 'LangChain', 'AI/ML'],
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
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="section-label">Work Experience</p>
          <h2 className="section-title">Where I&apos;ve Worked</h2>
          <div className="divider mx-auto" />
        </motion.div>

        <div className="relative">
          {/* Violet→cyan timeline line */}
          <div
            className="absolute hidden md:block"
            style={{
              left: '50%',
              transform: 'translateX(-50%)',
              top: 0, bottom: 0,
              width: '1px',
              background: 'linear-gradient(180deg, transparent, #7c3aed 15%, #06b6d4 85%, transparent)',
            }}
          />

          <div className="flex flex-col gap-12 md:gap-16">
            {experiences.map((exp, i) => (
              <div key={exp.company} className="md:relative block">
                {/* Mobile */}
                <div className="md:hidden card-base card-top-border" style={{ padding: '24px' }}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: '1.2rem', fontWeight: 700, color: '#f8f8ff', marginBottom: '0.25rem' }}>
                        {exp.company}
                      </h3>
                      <p style={{ color: '#06b6d4', fontSize: '0.88rem', fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>
                        {exp.role}
                      </p>
                    </div>
                    {exp.current && (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full flex-shrink-0"
                        style={{ background: 'rgba(34,197,94,0.09)', border: '1px solid rgba(34,197,94,0.28)', fontSize: '0.68rem', color: '#22c55e', fontFamily: "'DM Mono', monospace" }}>
                        <span className="pulse-dot" style={{ width: '6px', height: '6px' }} />
                        Current
                      </span>
                    )}
                  </div>
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.72rem', color: '#44445a', marginBottom: '16px' }}>
                    {exp.period} · {exp.location}
                  </p>
                  <ul className="flex flex-col gap-3 mb-4">
                    {exp.bullets.map((b, j) => (
                      <li key={j} className="flex gap-2.5" style={{ fontSize: '0.875rem', color: '#8888aa', fontFamily: "'Inter', sans-serif", lineHeight: 1.65 }}>
                        <span style={{ color: '#7c3aed', flexShrink: 0, marginTop: '0.25rem' }}>▸</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">{exp.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}</div>
                </div>
                {/* Desktop */}
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
