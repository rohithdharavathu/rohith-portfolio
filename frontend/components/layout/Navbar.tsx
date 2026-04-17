'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useAgent } from '@/components/agent/AgentContext';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Publications', href: '#publications' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openAgent } = useAgent();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(10, 10, 15, 0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
        boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'none',
      }}
    >
      <div className="section-container">
        <div className="flex items-center justify-between" style={{ height: '64px' }}>
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center justify-center w-10 h-10 rounded-lg font-bold text-sm transition-all duration-200 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
              fontFamily: "'Syne', sans-serif",
              color: 'white',
              fontSize: '0.85rem',
              letterSpacing: '0.02em',
            }}
          >
            RD
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="px-4 py-2 text-sm font-medium rounded-md transition-all duration-200"
                style={{
                  color: '#a0a0b0',
                  fontFamily: "'Inter', sans-serif",
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.color = '#f0f0f0';
                  (e.target as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.color = '#a0a0b0';
                  (e.target as HTMLButtonElement).style.background = 'transparent';
                }}
              >
                {link.label}
              </button>
            ))}

            <button
              onClick={() => { scrollTo('#agent'); openAgent(); }}
              className="flex items-center gap-2 ml-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
              style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.25)',
                color: '#22c55e',
                fontFamily: "'Inter', sans-serif",
                cursor: 'pointer',
              }}
            >
              <span className="pulse-dot" />
              Talk to AI
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ color: '#a0a0b0', background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: 'rgba(10, 10, 15, 0.98)',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              overflow: 'hidden',
            }}
          >
            <div className="section-container py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="text-left px-4 py-3 text-sm font-medium rounded-md w-full"
                  style={{
                    color: '#a0a0b0',
                    fontFamily: "'Inter', sans-serif",
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => { setMobileOpen(false); scrollTo('#agent'); openAgent(); }}
                className="flex items-center gap-2 px-4 py-3 rounded-md text-sm font-medium mt-2"
                style={{
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.25)',
                  color: '#22c55e',
                  fontFamily: "'Inter', sans-serif",
                  cursor: 'pointer',
                }}
              >
                <span className="pulse-dot" />
                Talk to AI
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
