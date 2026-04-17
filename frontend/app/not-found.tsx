'use client';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: '#0a0a0f' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center px-6"
      >
        <p
          style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: '0.75rem',
            color: '#3b82f6',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}
        >
          404
        </p>
        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: '1rem',
            lineHeight: 1.1,
          }}
        >
          Page not found.
        </h1>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '1rem',
            color: '#606070',
            marginBottom: '2.5rem',
            maxWidth: '360px',
            margin: '0 auto 2.5rem',
          }}
        >
          This page doesn&apos;t exist. Head back and explore the portfolio.
        </p>
        <a
          href="/"
          className="btn-secondary inline-flex"
        >
          <ArrowLeft size={16} />
          Back to portfolio
        </a>
      </motion.div>
    </div>
  );
}
