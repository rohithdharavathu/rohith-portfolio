'use client';
import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import SkillCluster from '@/components/ui/SkillCluster';

const clusters = [
  {
    category: 'ML / NLP',
    icon: '🧠',
    color: '#8b5cf6',
    skills: [
      { name: 'Python', level: 95 },
      { name: 'scikit-learn', level: 88 },
      { name: 'NLP Pipelines', level: 90 },
      { name: 'Model Training & Evaluation', level: 85 },
      { name: 'Transformers / HuggingFace', level: 82 },
    ],
  },
  {
    category: 'Generative AI',
    icon: '⚡',
    color: '#3b82f6',
    skills: [
      { name: 'Claude API / Anthropic SDK', level: 95 },
      { name: 'LangChain', level: 88 },
      { name: 'RAG Architectures', level: 90 },
      { name: 'Prompt Engineering', level: 92 },
      { name: 'Multi-Agent Systems', level: 85 },
    ],
  },
  {
    category: 'Cloud & Infrastructure',
    icon: '☁️',
    color: '#f59e0b',
    skills: [
      { name: 'AWS (EC2, Lambda, ECS, S3)', level: 82 },
      { name: 'Docker', level: 85 },
      { name: 'FastAPI', level: 90 },
      { name: 'CI/CD Pipelines', level: 78 },
    ],
  },
  {
    category: 'Data & Tools',
    icon: '🔧',
    color: '#06b6d4',
    skills: [
      { name: 'SQL / DuckDB', level: 88 },
      { name: 'Data Pipelines', level: 85 },
      { name: 'tree-sitter / AST Parsing', level: 80 },
      { name: 'ChromaDB / Vector DBs', level: 75 },
      { name: 'Git / GitHub API', level: 90 },
    ],
  },
];

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="skills" className="section-padding" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="section-label">Technical Depth</p>
          <h2 className="section-title">Skills</h2>
          <div className="divider mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {clusters.map((cluster, i) => (
            <SkillCluster key={cluster.category} {...cluster} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}
