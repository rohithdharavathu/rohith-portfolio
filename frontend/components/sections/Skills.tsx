'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const clusters = [
  {
    category: 'ML / NLP',
    color: '#8b5cf6',
    skills: ['Python', 'scikit-learn', 'NLP Pipelines', 'Transformers', 'Model Training', 'Feature Engineering', 'Statistical Modeling'],
  },
  {
    category: 'Generative AI',
    color: '#7c3aed',
    skills: ['Claude API', 'LangChain', 'RAG', 'Prompt Engineering', 'Multi-Agent Systems', 'Streaming', 'Tool Use'],
  },
  {
    category: 'Cloud & Infrastructure',
    color: '#06b6d4',
    skills: ['AWS (EC2/Lambda/ECS/S3)', 'Docker', 'FastAPI', 'REST APIs', 'CI/CD', 'GitHub API'],
  },
  {
    category: 'Data & Tools',
    color: '#22c55e',
    skills: ['SQL', 'DuckDB', 'Power BI', 'A/B Testing', 'tree-sitter', 'ChromaDB', 'Data Pipelines'],
  },
];

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="skills" className="section-padding" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <p className="section-label">Technical Depth</p>
          <h2 className="section-title">Skills</h2>
          <div className="divider mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {clusters.map((cluster, i) => (
            <motion.div
              key={cluster.category}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="card-base"
              style={{ padding: '24px' }}
            >
              <div className="flex items-center gap-2 mb-5">
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: cluster.color,
                    boxShadow: `0 0 8px ${cluster.color}80`,
                    flexShrink: 0,
                  }}
                />
                <h3
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: cluster.color,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  {cluster.category}
                </h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {cluster.skills.map((skill, j) => (
                  <motion.span
                    key={skill}
                    className="skill-pill"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: i * 0.1 + j * 0.04, duration: 0.3 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
