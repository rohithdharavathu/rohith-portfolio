'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { sendChatMessage } from '@/lib/api';
import { useAgent } from './AgentContext';

interface Message { role: 'user' | 'assistant'; content: string; }

const SUGGESTED = [
  "What has Rohith built in GenAI?",
  "How does CodeSage work?",
  "What's Rohith's experience at HDFC?",
];

export default function AgentModal() {
  const { isOpen, prefillQuestion, closeAgent, clearPrefill } = useAgent();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 350);
  }, [isOpen]);

  useEffect(() => {
    if (prefillQuestion && isOpen) {
      clearPrefill();
      setTimeout(() => sendMessage(prefillQuestion), 200);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillQuestion, isOpen]);

  const sendMessage = useCallback(async (query: string) => {
    if (!query.trim() || loading) return;
    setMessages((prev) => [...prev, { role: 'user', content: query }]);
    setInput('');
    setLoading(true);
    setStreamingContent('');
    let accumulated = '';
    await sendChatMessage(
      query,
      (chunk) => { accumulated += chunk; setStreamingContent(accumulated); },
      () => { setMessages((prev) => [...prev, { role: 'assistant', content: accumulated }]); setStreamingContent(''); setLoading(false); },
      (err) => { setMessages((prev) => [...prev, { role: 'assistant', content: err }]); setStreamingContent(''); setLoading(false); }
    );
  }, [loading]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeAgent(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closeAgent]);

  const hasMessages = messages.length > 0 || !!streamingContent;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="agent-chat-panel"
          initial={{ opacity: 0, scale: 0.85, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 16 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          style={{ transformOrigin: 'bottom right' }}
        >
          {/* Header */}
          <div style={{
            height: '64px',
            flexShrink: 0,
            background: 'linear-gradient(135deg, rgba(124,58,237,0.13), rgba(6,182,212,0.13))',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            gap: '12px',
          }}>
            {/* RD avatar */}
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              fontSize: '0.78rem', fontWeight: 800,
              color: 'white',
              fontFamily: "'Bricolage Grotesque', sans-serif",
            }}>
              RD
            </div>

            {/* Name + status */}
            <div style={{ flex: 1 }}>
              <p style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                fontWeight: 700, fontSize: '0.95rem', color: '#f8f8ff', lineHeight: 1.2,
              }}>
                Rohith&apos;s AI
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                <span className="pulse-dot" style={{ width: '6px', height: '6px' }} />
                <span style={{ fontSize: '0.68rem', color: '#22c55e', fontFamily: "'DM Mono', monospace" }}>
                  Online · Ask me anything
                </span>
              </div>
            </div>

            {/* Close */}
            <button
              onClick={closeAgent}
              style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                color: '#8888aa', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => { (e.currentTarget).style.background = 'rgba(255,255,255,0.1)'; (e.currentTarget).style.color = '#f8f8ff'; }}
              onMouseLeave={(e) => { (e.currentTarget).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget).style.color = '#8888aa'; }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            {!hasMessages && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px' }}
              >
                <p style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '0.7rem', color: '#44445a',
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  marginBottom: '4px',
                }}>
                  Try asking:
                </p>
                {SUGGESTED.map((q, i) => (
                  <motion.button
                    key={q}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.07 }}
                    onClick={() => sendMessage(q)}
                    style={{
                      background: 'rgba(124,58,237,0.07)',
                      border: '1px solid rgba(124,58,237,0.25)',
                      borderRadius: '8px',
                      padding: '9px 12px',
                      color: '#c4b5fd',
                      fontSize: '13px',
                      fontFamily: "'Inter', sans-serif",
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      lineHeight: 1.4,
                    }}
                    onMouseEnter={(e) => { (e.currentTarget).style.background = 'rgba(124,58,237,0.14)'; (e.currentTarget).style.borderColor = 'rgba(124,58,237,0.5)'; }}
                    onMouseLeave={(e) => { (e.currentTarget).style.background = 'rgba(124,58,237,0.07)'; (e.currentTarget).style.borderColor = 'rgba(124,58,237,0.25)'; }}
                  >
                    {q}
                  </motion.button>
                ))}
              </motion.div>
            )}

            {messages.map((msg, i) => (
              <ChatMessage key={i} role={msg.role} content={msg.content} />
            ))}

            {streamingContent && (
              <ChatMessage role="assistant" content={streamingContent} isStreaming />
            )}

            {loading && !streamingContent && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                <div style={{
                  width: '26px', height: '26px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, fontSize: '0.58rem', fontWeight: 700, color: 'white',
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                }}>
                  AI
                </div>
                <div style={{
                  background: '#1a1a2e',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '4px 16px 16px 16px',
                  padding: '12px 16px',
                  display: 'flex', gap: '4px', alignItems: 'center',
                }}>
                  {[0, 1, 2].map((j) => (
                    <motion.div
                      key={j}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ repeat: Infinity, duration: 0.9, delay: j * 0.18 }}
                      style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#7c3aed' }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '12px 16px', flexShrink: 0 }}>
            <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} style={{ position: 'relative' }}>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything about Rohith..."
                disabled={loading}
                style={{
                  width: '100%',
                  background: '#1a1a2e',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '10px 48px 10px 14px',
                  color: '#f8f8ff',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(124,58,237,0.5)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; }}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                style={{
                  position: 'absolute',
                  right: '7px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '32px', height: '32px',
                  borderRadius: '50%',
                  background: input.trim() && !loading
                    ? 'linear-gradient(135deg, #7c3aed, #06b6d4)'
                    : 'rgba(255,255,255,0.05)',
                  border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: input.trim() && !loading ? 'pointer' : 'default',
                  transition: 'all 0.2s',
                }}
              >
                <ArrowRight size={15} color={input.trim() && !loading ? 'white' : '#44445a'} />
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
