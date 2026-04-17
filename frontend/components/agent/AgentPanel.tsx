'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { sendChatMessage } from '@/lib/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED = [
  "What has Rohith built in GenAI?",
  "How does CodeSage work?",
  "What does Rohith do at HDFC Bank?",
];

const DEMO_CONVERSATION: Message[] = [
  { role: 'user', content: "What makes Rohith different from other ML engineers?" },
  {
    role: 'assistant',
    content: "Most ML engineers I know stop at model training. I build the full system — from data pipeline to production API to the AI agent answering your questions right now. At HDFC, I ship segmentation models and fraud detection systems reaching 10M+ users. Outside of work, I build things like CodeSage AI out of pure curiosity. The difference is: I care about systems that actually work in production, not just Jupyter notebooks.",
  },
];

export default function AgentPanel({ prefillQuestion = '', onClearPrefill }: {
  prefillQuestion?: string;
  onClearPrefill?: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [demoPlayed, setDemoPlayed] = useState(false);
  const [demoActive, setDemoActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  // Play demo on mount
  useEffect(() => {
    if (demoPlayed) return;
    setDemoPlayed(true);
    setDemoActive(true);

    let cancelled = false;
    const playDemo = async () => {
      await new Promise((r) => setTimeout(r, 600));
      if (cancelled) return;

      // Type user message
      setMessages([{ role: 'user', content: DEMO_CONVERSATION[0].content }]);
      await new Promise((r) => setTimeout(r, 500));
      if (cancelled) return;

      // Stream assistant response
      const fullText = DEMO_CONVERSATION[1].content;
      for (let i = 0; i <= fullText.length; i += 3) {
        if (cancelled) return;
        setStreamingContent(fullText.slice(0, i));
        await new Promise((r) => setTimeout(r, 18));
      }

      if (cancelled) return;
      setStreamingContent('');
      setMessages([DEMO_CONVERSATION[0], DEMO_CONVERSATION[1]]);
      setDemoActive(false);
    };

    playDemo();
    return () => { cancelled = true; };
  }, [demoPlayed]);

  // Handle prefill
  useEffect(() => {
    if (prefillQuestion && !demoActive) {
      setInput(prefillQuestion);
      onClearPrefill?.();
      inputRef.current?.focus();
    }
  }, [prefillQuestion, demoActive, onClearPrefill]);

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
      (chunk) => {
        accumulated += chunk;
        setStreamingContent(accumulated);
      },
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

  return (
    <div
      className="card-base flex flex-col"
      style={{ height: '480px', maxWidth: '640px', width: '100%' }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}
          >
            <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>AI</span>
          </div>
          <div>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f0f0f0', fontFamily: "'Syne', sans-serif" }}>
              Rohith&apos;s AI
            </p>
            <p style={{ fontSize: '0.7rem', color: '#606070', fontFamily: "'Geist Mono', monospace" }}>
              Trained on my work
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="pulse-dot" />
          <span style={{ fontSize: '0.72rem', color: '#22c55e', fontFamily: "'Geist Mono', monospace" }}>
            Online
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4">
        {messages.length === 0 && !demoActive && !streamingContent && (
          <div className="flex items-center justify-center h-full">
            <p style={{ color: '#404050', fontSize: '0.85rem', fontFamily: "'Geist Mono', monospace", textAlign: 'center' }}>
              Ask me anything about Rohith&apos;s work
            </p>
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
            <div
              className="px-4 py-3 rounded-2xl"
              style={{ background: '#1a1a24', border: '1px solid rgba(255,255,255,0.06)' }}
            >
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
          disabled={loading || demoActive}
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
          disabled={!input.trim() || loading || demoActive}
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
    </div>
  );
}
