'use client';
import { motion } from 'framer-motion';

interface StatCardProps {
  value: string;
  label: string;
  icon?: string;
}

export default function StatCard({ value, label, icon }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, translateY: -2 }}
      className="card-base flex items-center gap-4"
      style={{ padding: '20px 24px' }}
    >
      {icon && (
        <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{icon}</span>
      )}
      <div>
        <div
          className="gradient-text"
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: '1.8rem',
            fontWeight: 800,
            lineHeight: 1,
            marginBottom: '0.25rem',
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.72rem',
            color: '#8888aa',
            fontWeight: 400,
          }}
        >
          {label}
        </div>
      </div>
    </motion.div>
  );
}
