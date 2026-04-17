'use client';
import { motion } from 'framer-motion';

interface Skill {
  name: string;
  level: number; // 0-100
}

interface SkillClusterProps {
  category: string;
  icon: string;
  skills: Skill[];
  color: string;
  index: number;
  isInView: boolean;
}

export default function SkillCluster({ category, icon, skills, color, index, isInView }: SkillClusterProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card-base p-6"
    >
      <div className="flex items-center gap-3 mb-5">
        <span style={{ fontSize: '1.4rem' }}>{icon}</span>
        <h3
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: '1rem',
            fontWeight: 700,
            color: '#ffffff',
          }}
        >
          {category}
        </h3>
      </div>

      <div className="flex flex-col gap-3">
        {skills.map((skill, i) => (
          <div key={skill.name}>
            <div className="flex justify-between items-center mb-1">
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.82rem',
                  color: '#c0c0d0',
                  fontWeight: 500,
                }}
              >
                {skill.name}
              </span>
              <span
                style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: '0.7rem',
                  color: '#606070',
                }}
              >
                {skill.level}%
              </span>
            </div>
            <div
              style={{
                height: '3px',
                background: 'rgba(255,255,255,0.06)',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={isInView ? { width: `${skill.level}%` } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 + i * 0.05 + 0.3, ease: 'easeOut' }}
                style={{
                  height: '100%',
                  background: `linear-gradient(90deg, ${color}, ${color}99)`,
                  borderRadius: '2px',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
