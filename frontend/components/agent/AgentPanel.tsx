'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { sendChatMessage } from '@/lib/api';

interface Message { role: 'user' | 'assistant'; content: string; }

const DEMO_Q = "What makes Rohith different from other ML engineers?";
const DEMO_A = "Most ML engineers stop at model training. I build the full system — from data pipeline to production API, reaching 10M+ users at HDFC, to the AI agent you're talking to right now. Outside of work I build things like CodeSage AI out of pure curiosity. The difference: I care about systems that actually work in production, not just Jupyter notebooks.";

const SUGGESTED = [
  "What has Rohith built in GenAI?",
  "How does CodeSage work?",
  "What's Rohith's experience at HDFC?",
];

export default function AgentPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [demoActive, setDemoActive] = useState(false);
  const [demoPlayed, setDemoPlayed] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  useEffect(() => {
    if (demoPlayed) return;
    setDemoPlayed(true);
    setDemoActive(true);
    let cancelled = false;

    const play = async () => {
      await new Promise((r) => setTimeout(r, 700));
      if (cancelled) return;
      setMessages([{ role: 'user', content: DEMO_Q }]);
      await new Promise((r) => setTimeout(r, 400));
      if (cancelled) return;
      for (let i = 0; i <= DEMO_A.length; i += 4) {
        if (cancelled) return;
        setStreamingContent(DEMO_A.slice(0, i));
        await new Promise((r) => setTimeout(r, 16));
      }
      if (cancelled) return;
      setStreamingContent('');
      setMessages([{ role: 'user', content: DEMO_Q }, { role: 'assistant', content: DEMO_A }]);
      setDemoActive(false);
    };
    play();
    return () => { cancelled = true; };
  }, [demoPlayed]);

  const sendMessage = useCallback(async (query: string) => {
    if (!query.trim() || loading || demoActive) return;
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
  }, [loading, demoActive]);

  return (
    <div style={{
      width: '100%',
      maxWidth: '600px',
      height: '440px',
      display: 'flex',
      flexDirection: 'column',
      background: '#0f0f1a',
      border: '1px solid rgba(124,58,237,0.3)',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 8px 48px rgba(0,0,0,0.4), 0 0 24px rgba(124,58,237,0.1)',
    }}>
      {/* Header */}
      <div style={{
        height: '56px', flexShrink: 0,
        background: 'linear-gradient(135deg, rgba(124,58,237,0.13), rgba(6,182,212,0.13))',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        display: 'flex', alignItems: 'center',
        padding: '0 16px', gap: '10px',
      }}>
        <div style={{
          width: '34px', height: '34px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, fontSize: '0.7rem', fontWeight: 800,
          color: 'white', fontFamily: "'Bricolage Grotesque', sans-serif",
        }}>
          RD
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 700, fontSize: '0.88rem', color: '#f8f8ff', lineHeight: 1.2 }}>
            Rohith&apos;s AI
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '1px' }}>
            <span className="pulse-dot" style={{ width: '5px', height: '5px' }} />
            <span style={{ fontSize: '0.65rem', color: '#22c55e', fontFamily: "'DM Mono', monospace" }}>
              {demoActive ? 'Typing demo...' : 'Online · Ask me anything'}
            </span>
          </div>
        </div>
        {demoActive && (
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.62rem', color: '#44445a',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '4px',
            padding: '3px 8px',
          }}>
            DEMO
          </span>
        )}
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
              flexShrink: 0, fontSize: '0.58rem', fontWeight: 700,
              color: 'white', fontFamily: "'Bricolage Grotesque', sans-serif",
            }}>
              AI
            </div>
            <div style={{
              background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '4px 16px 16px 16px', padding: '12px 16px',
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
        {!demoActive && messages.length === 0 && !streamingContent && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {SUGGESTED.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                style={{
                  background: 'rgba(124,58,237,0.07)', border: '1px solid rgba(124,58,237,0.22)',
                  borderRadius: '8px', padding: '9px 12px', color: '#c4b5fd',
                  fontSize: '13px', fontFamily: "'Inter', sans-serif",
                  textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { (e.currentTarget).style.background = 'rgba(124,58,237,0.14)'; (e.currentTarget).style.borderColor = 'rgba(124,58,237,0.45)'; }}
                onMouseLeave={(e) => { (e.currentTarget).style.background = 'rgba(124,58,237,0.07)'; (e.currentTarget).style.borderColor = 'rgba(124,58,237,0.22)'; }}
              >
                {q}
              </button>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '10px 14px', flexShrink: 0 }}>
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} style={{ position: 'relative' }}>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={demoActive ? 'Demo playing...' : 'Ask me anything about Rohith...'}
            disabled={loading || demoActive}
            style={{
              width: '100%', background: '#1a1a2e',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: '12px', padding: '9px 46px 9px 14px',
              color: '#f8f8ff', fontFamily: "'Inter', sans-serif",
              fontSize: '0.85rem', outline: 'none', transition: 'border-color 0.2s',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'rgba(124,58,237,0.5)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; }}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading || demoActive}
            style={{
              position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)',
              width: '30px', height: '30px', borderRadius: '50%',
              background: input.trim() && !loading && !demoActive
                ? 'linear-gradient(135deg, #7c3aed, #06b6d4)'
                : 'rgba(255,255,255,0.04)',
              border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: input.trim() && !loading && !demoActive ? 'pointer' : 'default',
              transition: 'all 0.2s',
            }}
          >
            <ArrowRight size={14} color={input.trim() && !loading && !demoActive ? 'white' : '#44445a'} />
          </button>
        </form>
      </div>
    </div>
  );
}
