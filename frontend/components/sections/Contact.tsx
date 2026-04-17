'use client';
import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { GitBranch, Link2, Mail, Send } from 'lucide-react';

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus('sent');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const links = [
    { icon: Mail, label: 'Email', href: 'mailto:rohith.dharavathu.112@gmail.com', value: 'rohith.dharavathu.112@gmail.com', color: '#7c3aed' },
    { icon: Link2, label: 'LinkedIn', href: '#', value: 'linkedin.com/in/rohithreddy', color: '#06b6d4' },
    { icon: GitBranch, label: 'GitHub', href: 'https://github.com/rohithdharavathu', value: 'github.com/rohithdharavathu', color: '#8b5cf6' },
  ];

  return (
    <section id="contact" className="section-padding" ref={ref}>
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="section-label">Get In Touch</p>
          <h2 className="section-title">Contact</h2>
          <div className="divider mx-auto" />
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              color: '#8888aa',
              marginTop: '1rem',
              fontSize: '1rem',
            }}
          >
            Always open to interesting problems.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 max-w-3xl mx-auto">
          {/* Links */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col gap-4"
          >
            {links.map(({ icon: Icon, label, href, value, color }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="card-base flex items-center gap-4 group"
                style={{ textDecoration: 'none', padding: '20px 24px' }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-110"
                  style={{ background: `${color}12`, border: `1px solid ${color}30` }}
                >
                  <Icon size={18} style={{ color }} />
                </div>
                <div>
                  <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: '0.9rem', fontWeight: 600, color: '#f8f8ff', marginBottom: '0.15rem' }}>
                    {label}
                  </p>
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.72rem', color: '#44445a' }}>
                    {value}
                  </p>
                </div>
              </a>
            ))}
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-3"
          >
            {[
              { name: 'name', type: 'text', placeholder: 'Your name' },
              { name: 'email', type: 'email', placeholder: 'Your email' },
            ].map(({ name, type, placeholder }) => (
              <input
                key={name}
                type={type}
                placeholder={placeholder}
                value={form[name as keyof typeof form]}
                onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
                required
                className="px-4 py-3 rounded-lg text-sm"
                style={{
                  background: '#0d0d1a',
                  border: '1px solid rgba(255,255,255,0.07)',
                  color: '#f8f8ff',
                  fontFamily: "'Inter', sans-serif",
                  outline: 'none',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(124,58,237,0.4)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.07)'; }}
              />
            ))}
            <textarea
              placeholder="Your message"
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              required
              rows={4}
              className="px-4 py-3 rounded-lg text-sm resize-none"
              style={{
                background: '#0d0d1a',
                border: '1px solid rgba(255,255,255,0.07)',
                color: '#f8f8ff',
                fontFamily: "'Inter', sans-serif",
                outline: 'none',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'rgba(124,58,237,0.4)'; }}
              onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.07)'; }}
            />
            <button
              type="submit"
              disabled={status === 'sending' || status === 'sent'}
              className="btn-primary justify-center"
            >
              {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Message sent ✓' : (
                <>Send Message <Send size={15} /></>
              )}
            </button>
            {status === 'error' && (
              <p style={{ fontSize: '0.8rem', color: '#ef4444', fontFamily: "'Inter', sans-serif" }}>
                Something went wrong. Try emailing directly.
              </p>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
