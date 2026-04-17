export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '2rem 0',
        background: '#0a0a0f',
      }}
    >
      <div className="section-container flex flex-col md:flex-row items-center justify-between gap-4">
        <div
          style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: '0.8rem',
            color: '#606070',
          }}
        >
          © 2025 Rohith Dharavathu
        </div>
        <div
          style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: '0.75rem',
            color: '#404050',
          }}
        >
          Built entirely with Claude Code · Vibe coded, not hand-typed
        </div>
      </div>
    </footer>
  );
}
