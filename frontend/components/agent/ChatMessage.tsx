'use client';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

export default function ChatMessage({ role, content, isStreaming }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isUser && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', minWidth: '28px' }}
        >
          <span style={{ fontSize: '0.7rem' }}>AI</span>
        </div>
      )}

      <div
        className="max-w-[85%] rounded-2xl text-sm leading-relaxed"
        style={{
          padding: '12px 16px',
          background: isUser ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : '#1a1a24',
          color: isUser ? 'white' : '#e0e0f0',
          borderBottomRightRadius: isUser ? '4px' : '16px',
          borderBottomLeftRadius: isUser ? '16px' : '4px',
          border: isUser ? 'none' : '1px solid rgba(255,255,255,0.06)',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {isUser ? (
          <span style={{ whiteSpace: 'pre-wrap' }}>{content}</span>
        ) : (
          <ReactMarkdown
            components={{
              p: ({ children }) => (
                <p style={{ margin: '0 0 0.5em 0', lineHeight: 1.65 }}>{children}</p>
              ),
              strong: ({ children }) => (
                <strong style={{ color: '#ffffff', fontWeight: 600 }}>{children}</strong>
              ),
              em: ({ children }) => (
                <em style={{ color: '#c8d8f0' }}>{children}</em>
              ),
              ul: ({ children }) => (
                <ul style={{ margin: '0.4em 0', paddingLeft: '1.25em', listStyleType: 'disc' }}>{children}</ul>
              ),
              ol: ({ children }) => (
                <ol style={{ margin: '0.4em 0', paddingLeft: '1.25em' }}>{children}</ol>
              ),
              li: ({ children }) => (
                <li style={{ marginBottom: '0.2em', lineHeight: 1.6 }}>{children}</li>
              ),
              code: ({ children }) => (
                <code style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: '0.82em',
                  background: 'rgba(59,130,246,0.12)',
                  border: '1px solid rgba(59,130,246,0.2)',
                  borderRadius: '4px',
                  padding: '0.1em 0.4em',
                  color: '#93c5fd',
                }}>
                  {children}
                </code>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        )}
        {isStreaming && <span className="typing-cursor" />}
      </div>

      {isUser && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: '#1e1e2a', border: '1px solid rgba(255,255,255,0.1)', minWidth: '28px' }}
        >
          <span style={{ fontSize: '0.65rem', color: '#a0a0b0' }}>You</span>
        </div>
      )}
    </motion.div>
  );
}
