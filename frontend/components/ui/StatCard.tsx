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
      whileHover={{ scale: 1.03 }}
      className="card-base p-5 text-center"
    >
      {icon && <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{icon}</div>}
      <div
        className="gradient-text"
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: '2rem',
          fontWeight: 800,
          lineHeight: 1,
          marginBottom: '0.4rem',
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: '0.85rem',
          color: '#a0a0b0',
          fontWeight: 500,
        }}
      >
        {label}
      </div>
    </motion.div>
  );
}
