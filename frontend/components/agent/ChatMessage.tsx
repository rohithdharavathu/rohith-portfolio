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
      transition={{ duration: 0.25 }}
      style={{
        display: 'flex',
        gap: '8px',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        alignItems: 'flex-end',
      }}
    >
      {!isUser && (
        <div style={{
          width: '26px', height: '26px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, fontSize: '0.58rem', fontWeight: 700, color: 'white',
          fontFamily: "'Bricolage Grotesque', sans-serif",
          marginBottom: '2px',
        }}>
          AI
        </div>
      )}

      <div
        style={{
          maxWidth: '85%',
          padding: '10px 14px',
          fontSize: '0.875rem',
          lineHeight: 1.6,
          fontFamily: "'Inter', sans-serif",
          ...(isUser ? {
            background: 'linear-gradient(135deg, #7c3aed, #5b21b6)',
            color: 'white',
            borderRadius: '16px 16px 4px 16px',
          } : {
            background: '#1a1a2e',
            color: '#f0f0ff',
            borderRadius: '4px 16px 16px 16px',
            border: '1px solid rgba(255,255,255,0.06)',
          }),
        }}
      >
        {isUser ? (
          <span style={{ whiteSpace: 'pre-wrap' }}>{content}</span>
        ) : (
          <ReactMarkdown
            components={{
              p: ({ children }) => <p style={{ margin: '0 0 0.5em 0', lineHeight: 1.65 }}>{children}</p>,
              strong: ({ children }) => <strong style={{ color: '#ffffff', fontWeight: 600 }}>{children}</strong>,
              em: ({ children }) => <em style={{ color: '#c8d8f0' }}>{children}</em>,
              ul: ({ children }) => <ul style={{ margin: '0.4em 0', paddingLeft: '1.25em', listStyleType: 'disc' }}>{children}</ul>,
              ol: ({ children }) => <ol style={{ margin: '0.4em 0', paddingLeft: '1.25em' }}>{children}</ol>,
              li: ({ children }) => <li style={{ marginBottom: '0.2em', lineHeight: 1.6 }}>{children}</li>,
              code: ({ children }) => (
                <code style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '0.82em',
                  background: 'rgba(124,58,237,0.12)',
                  border: '1px solid rgba(124,58,237,0.2)',
                  borderRadius: '4px',
                  padding: '0.1em 0.4em',
                  color: '#c4b5fd',
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
    </motion.div>
  );
}
