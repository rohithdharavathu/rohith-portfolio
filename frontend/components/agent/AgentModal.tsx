'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { sendChatMessage } from '@/lib/api';
import { useAgent } from './AgentContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

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
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (prefillQuestion && isOpen) {
      setInput(prefillQuestion);
      clearPrefill();
      setTimeout(() => {
        sendMessage(prefillQuestion);
      }, 200);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillQuestion, isOpen]);

  const sendMessage = useCallback(async (query: string) => {
    if (!query.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setStreamingContent('');

    let accumulated = '';
    await sendChatMessage(
      query,
      (chunk) => { accumulated += chunk; setStreamingContent(accumulated); },
      () => {
        setMessages((prev) => [...prev, { role: 'assistant', content: accumulated }]);
        setStreamingContent('');
        setLoading(false);
      },
      (err) => {
        setMessages((prev) => [...prev, { role: 'assistant', content: err }]);
        setStreamingContent('');
        setLoading(false);
      }
    );
  }, [loading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeAgent();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closeAgent]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-6"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
          onClick={closeAgent}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="w-full max-w-lg flex flex-col"
            style={{
              background: '#111118',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              height: '580px',
              maxHeight: '85vh',
              boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(59,130,246,0.1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}
                >
                  <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>AI</span>
                </div>
                <div>
                  <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f0f0f0', fontFamily: "'Syne', sans-serif" }}>
                    Rohith&apos;s AI
                  </p>
                  <div className="flex items-center gap-1.5">
                    <span className="pulse-dot" style={{ width: '6px', height: '6px' }} />
                    <span style={{ fontSize: '0.7rem', color: '#22c55e', fontFamily: "'Geist Mono', monospace" }}>
                      Online · Ask me anything
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={closeAgent}
                style={{
                  color: '#606070',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => ((e.currentTarget).style.color = '#a0a0b0')}
                onMouseLeave={(e) => ((e.currentTarget).style.color = '#606070')}
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4">
              {messages.length === 0 && !streamingContent && (
                <div className="flex flex-col items-center justify-center h-full gap-5">
                  <p style={{ color: '#404050', fontSize: '0.85rem', fontFamily: "'Geist Mono', monospace", textAlign: 'center' }}>
                    Ask about projects, experience, or skills
                  </p>
                  <div className="flex flex-col gap-3 w-full">
                    {[
                      "What has Rohith built in GenAI?",
                      "How does CodeSage work?",
                      "What does Rohith do at HDFC Bank?",
                    ].map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        className="text-left px-4 py-3 rounded-lg text-sm transition-all duration-200"
                        style={{
                          background: 'rgba(59,130,246,0.06)',
                          border: '1px solid rgba(59,130,246,0.15)',
                          color: '#a0a0b0',
                          fontFamily: "'Inter', sans-serif",
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget).style.background = 'rgba(59,130,246,0.12)';
                          (e.currentTarget).style.borderColor = 'rgba(59,130,246,0.3)';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget).style.background = 'rgba(59,130,246,0.06)';
                          (e.currentTarget).style.borderColor = 'rgba(59,130,246,0.15)';
                        }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((msg, i) => (
                <ChatMessage key={i} role={msg.role} content={msg.content} />
              ))}
              {streamingContent && (
                <ChatMessage role="assistant" content={streamingContent} isStreaming />
              )}
              {loading && !streamingContent && (
                <div className="flex gap-3 justify-start">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}
                  >
                    <span style={{ fontSize: '0.6rem' }}>AI</span>
                  </div>
                  <div className="px-4 py-3 rounded-2xl" style={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ opacity: [0.3, 1, 0.3] }}
                          transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
                          style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#3b82f6' }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex gap-2 p-4"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about projects, experience, skills..."
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm"
                style={{
                  background: '#0d0d15',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#f0f0f0',
                  fontFamily: "'Inter', sans-serif",
                  outline: 'none',
                  fontSize: '0.875rem',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(59,130,246,0.4)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
                style={{
                  background: input.trim() && !loading ? '#3b82f6' : 'rgba(59,130,246,0.15)',
                  border: 'none',
                  cursor: input.trim() && !loading ? 'pointer' : 'default',
                  color: input.trim() && !loading ? 'white' : '#3b82f6',
                }}
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
