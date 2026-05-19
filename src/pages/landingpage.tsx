const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #080808; --glass: rgba(255,255,255,0.03); --glass-border: rgba(255,255,255,0.07);
    --text: #f5f5f5; --muted: #555555; --muted2: #888888;
  }
  html { scroll-behavior: smooth; }
  body { background: var(--bg); }
  .landing { min-height: 100vh; background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--text); overflow-x: hidden; }

  /* BLOBS */
  .blob { position: fixed; border-radius: 50%; filter: blur(140px); pointer-events: none; z-index: 0; }
  .blob-1 { width: 700px; height: 700px; background: rgba(255,255,255,0.022); top: -200px; left: -150px; animation: drift1 22s ease-in-out infinite; }
  .blob-2 { width: 500px; height: 500px; background: rgba(255,255,255,0.015); bottom: 0; right: -100px; animation: drift2 26s ease-in-out infinite; }
  .blob-3 { width: 400px; height: 400px; background: rgba(255,255,255,0.012); top: 50%; left: 50%; transform: translate(-50%,-50%); animation: drift1 18s ease-in-out infinite reverse; }
  @keyframes drift1 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(40px,-30px); } }
  @keyframes drift2 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-30px,30px); } }

  .grid-overlay { position: fixed; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.013) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.013) 1px,transparent 1px); background-size: 64px 64px; z-index: 0; pointer-events: none; }

  /* NAVBAR */
  .navbar { position: fixed; top: 0; left: 0; right: 0; z-index: 50; display: flex; align-items: center; justify-content: space-between; padding: 20px 64px; border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(8,8,8,0.7); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
  .brand { display: flex; align-items: center; gap: 10px; text-decoration: none; }
  .brand-icon { width: 34px; height: 34px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); border-radius: 9px; display: flex; align-items: center; justify-content: center; }
  .brand-icon svg { width: 18px; height: 18px; }
  .brand-name { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: var(--text); letter-spacing: -0.5px; }
  .nav-actions { display: flex; align-items: center; gap: 10px; }
  .nav-link { padding: 8px 18px; border-radius: 9px; font-size: 13px; font-weight: 500; text-decoration: none; color: var(--muted2); border: 1px solid transparent; transition: color 0.2s, border-color 0.2s, background 0.2s; }
  .nav-link:hover { color: var(--text); }
  .nav-link.outlined { border-color: rgba(255,255,255,0.1); color: var(--text); }
  .nav-link.outlined:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.18); }
  .nav-link.filled { background: #e8e8e8; color: #0a0a0a; border-color: #e8e8e8; font-weight: 600; }
  .nav-link.filled:hover { background: #fff; }

  /* HERO */
  .hero { position: relative; z-index: 1; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 120px 64px 80px; }
  .hero-eyebrow { display: inline-flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 500; letter-spacing: 2.5px; text-transform: uppercase; color: var(--muted2); border: 1px solid rgba(255,255,255,0.08); padding: 6px 14px; border-radius: 99px; margin-bottom: 32px; opacity: 0; animation: fadeUp 0.6s ease forwards 0.1s; }
  .hero-eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: #e8e8e8; }

  .hero-title { font-family: 'Syne', sans-serif; font-size: clamp(48px, 7vw, 88px); font-weight: 800; line-height: 1.02; letter-spacing: -3px; color: var(--text); max-width: 900px; margin-bottom: 28px; opacity: 0; animation: fadeUp 0.6s ease forwards 0.25s; }
  .hero-title .dim { color: #333333; }

  .hero-desc { font-size: clamp(15px, 1.5vw, 18px); color: var(--muted2); line-height: 1.75; max-width: 520px; font-weight: 300; margin-bottom: 48px; opacity: 0; animation: fadeUp 0.6s ease forwards 0.4s; }

  .hero-actions { display: flex; align-items: center; gap: 12px; opacity: 0; animation: fadeUp 0.6s ease forwards 0.55s; }
  .cta-primary { padding: 14px 32px; background: #e8e8e8; border: none; border-radius: 12px; color: #0a0a0a; font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; text-decoration: none; transition: background 0.2s, transform 0.15s; display: inline-flex; align-items: center; gap: 8px; }
  .cta-primary:hover { background: #fff; transform: translateY(-2px); }
  .cta-secondary { padding: 14px 32px; background: transparent; border: 1px solid rgba(255,255,255,0.12); border-radius: 12px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 400; text-decoration: none; transition: background 0.2s, border-color 0.2s, transform 0.15s; }
  .cta-secondary:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.2); transform: translateY(-2px); }

  .hero-stats { display: flex; align-items: center; gap: 48px; margin-top: 72px; opacity: 0; animation: fadeUp 0.6s ease forwards 0.7s; }
  .stat { display: flex; flex-direction: column; align-items: center; gap: 4px; }
  .stat-value { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; color: var(--text); letter-spacing: -1px; }
  .stat-label { font-size: 12px; color: var(--muted); }
  .stat-divider { width: 1px; height: 32px; background: rgba(255,255,255,0.07); }

  /* FEATURES */
  .features { position: relative; z-index: 1; padding: 120px 64px; }
  .section-header { text-align: center; margin-bottom: 64px; }
  .section-eyebrow { font-size: 11px; font-weight: 500; letter-spacing: 2.5px; text-transform: uppercase; color: var(--muted2); margin-bottom: 16px; }
  .section-title { font-family: 'Syne', sans-serif; font-size: clamp(32px, 4vw, 48px); font-weight: 800; color: var(--text); letter-spacing: -1.5px; line-height: 1.1; }
  .section-title .dim { color: #333333; }

  .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; max-width: 1100px; margin: 0 auto; }

  /* first two cards span more, last three fill the row */
  .feature-card { background: var(--glass); border: 1px solid var(--glass-border); border-radius: 20px; padding: 36px 32px; display: flex; flex-direction: column; gap: 16px; transition: border-color 0.25s, background 0.25s, transform 0.2s; position: relative; overflow: hidden; }
  .feature-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.03), transparent); opacity: 0; transition: opacity 0.25s; pointer-events: none; }
  .feature-card:hover { border-color: rgba(255,255,255,0.13); background: rgba(255,255,255,0.05); transform: translateY(-3px); }
  .feature-card:hover::before { opacity: 1; }
  .feature-card.wide { grid-column: span 2; }

  .feature-icon { width: 46px; height: 46px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 13px; display: flex; align-items: center; justify-content: center; color: var(--text); flex-shrink: 0; }
  .feature-tag { font-size: 10px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); }
  .feature-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; color: var(--text); letter-spacing: -0.4px; }
  .feature-desc { font-size: 14px; color: var(--muted2); line-height: 1.7; font-weight: 300; }
  .feature-pills { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
  .pill { font-size: 11px; color: var(--muted2); background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); padding: 3px 10px; border-radius: 99px; }

  /* FOOTER */
  .footer { position: relative; z-index: 1; border-top: 1px solid rgba(255,255,255,0.05); padding: 40px 64px; display: flex; align-items: center; justify-content: space-between; }
  .footer-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; }
  .footer-copy { font-size: 13px; color: var(--muted); }
  .footer-links { display: flex; gap: 24px; }
  .footer-link { font-size: 13px; color: var(--muted); text-decoration: none; transition: color 0.2s; }
  .footer-link:hover { color: var(--text); }

  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }

  @media (max-width: 900px) {
    .navbar { padding: 18px 24px; }
    .hero { padding: 100px 24px 64px; }
    .hero-title { letter-spacing: -2px; }
    .hero-stats { gap: 24px; }
    .features { padding: 80px 24px; }
    .features-grid { grid-template-columns: 1fr; }
    .feature-card.wide { grid-column: span 1; }
    .footer { flex-direction: column; gap: 20px; padding: 32px 24px; text-align: center; }
    .footer-links { justify-content: center; }
  }
`;

const features = [
  {
    tag: "Knowledge",
    title: "My Brain",
    desc: "Save links, articles, and resources from anywhere on the web. Source-aware cards for Twitter, YouTube, and Reddit. Everything you save is indexed into a RAG pipeline — query your entire knowledge base in natural language.",
    pills: ["RAG Pipeline", "URL Scraping", "Smart Search"],
    wide: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C8.5 2 6 4.5 6 7.5c0 2 1 3.7 2.5 4.7L8 16h8l-.5-3.8C17 11.2 18 9.5 18 7.5 18 4.5 15.5 2 12 2z"/>
        <line x1="9" y1="17" x2="15" y2="17"/><line x1="9.5" y1="20" x2="14.5" y2="20"/>
      </svg>
    ),
  },
  {
    tag: "Learning",
    title: "AI Roadmaps",
    desc: "Generate structured, phase-wise learning plans from a single goal. Broken into phases, tasks, and subtasks with resources — tailored to your level and schedule.",
    pills: ["LLM-Powered", "Phase Tracking"],
    wide: false,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 17l4-8 4 4 4-6 4 10"/><path d="M3 17h18"/>
      </svg>
    ),
  },
  {
    tag: "Productivity",
    title: "Smart Todo",
    desc: "Auto-generates your daily task list from active roadmap progress. Completing tasks syncs back to your roadmap in real time — no manual updates.",
    pills: ["Roadmap Sync", "Daily Gen"],
    wide: false,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
  },
  {
    tag: "Interview Prep",
    title: "AI Interviewer",
    desc: "Voice-powered mock interviews with configurable personas — React Developer, DSA, System Design, Behavioural, and more. A coding window appears automatically when the interviewer asks a coding question.",
    pills: ["VAPI / LiveKit", "Monaco Editor", "Persona System"],
    wide: false,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
      </svg>
    ),
  },
  {
    tag: "Scheduling",
    title: "Dynamic Timetable",
    desc: "Upload your academic schedule and get an interactive weekly view. Browser notifications fire 5 minutes before every class — no setup, no manual calendar entry.",
    pills: ["Web Notifications", "Auto-Parse", "5min Alerts"],
    wide: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
];

export default function Landing() {
  return (
    <>
      <style>{styles}</style>
      <div className="landing">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="grid-overlay" />

        {/* NAVBAR */}
        <nav className="navbar">
          <a href="/" className="brand">
            <div className="brand-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.5 2 6 4.5 6 7.5c0 2 1 3.7 2.5 4.7L8 16h8l-.5-3.8C17 11.2 18 9.5 18 7.5 18 4.5 15.5 2 12 2z" fill="white" fillOpacity="0.9"/>
                <rect x="9" y="17" width="6" height="1.5" rx="0.75" fill="white" fillOpacity="0.6"/>
                <rect x="9.5" y="19.5" width="5" height="1.5" rx="0.75" fill="white" fillOpacity="0.4"/>
              </svg>
            </div>
            <span className="brand-name">brainly</span>
          </a>
          <div className="nav-actions">
            <a href="/signin" className="nav-link">Sign in</a>
            <a href="/signup" className="nav-link filled">Get started</a>
          </div>
        </nav>

        {/* HERO */}
        <section className="hero">
          <div className="hero-eyebrow">
            <div className="hero-eyebrow-dot" />
            AI-powered for learners
          </div>

          <h1 className="hero-title">
            Your second brain.<br />
            <span className="dim">Finally, all in one place.</span>
          </h1>

          <p className="hero-desc">
            Capture knowledge, generate learning roadmaps, prep for interviews, and never miss a class — all from a single platform built for how you actually learn.
          </p>

          <div className="hero-actions">
            <a href="/signup" className="cta-primary">
              Start for free
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </a>
            <a href="/signin" className="cta-secondary">Sign in</a>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-value">5</span>
              <span className="stat-label">Core features</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-value">RAG</span>
              <span className="stat-label">Knowledge engine</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-value">0</span>
              <span className="stat-label">Context lost</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-value">AI</span>
              <span className="stat-label">Interview agent</span>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="features">
          <div className="section-header">
            <p className="section-eyebrow">Everything you need</p>
            <h2 className="section-title">
              Built for the way<br />
              <span className="dim">you actually learn.</span>
            </h2>
          </div>

          <div className="features-grid">
            {features.map((f) => (
              <div key={f.title} className={`feature-card${f.wide ? " wide" : ""}`}>
                <div className="feature-icon">{f.icon}</div>
                <div>
                  <p className="feature-tag">{f.tag}</p>
                  <p className="feature-title">{f.title}</p>
                </div>
                <p className="feature-desc">{f.desc}</p>
                <div className="feature-pills">
                  {f.pills.map((pill) => (
                    <span key={pill} className="pill">{pill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <a href="/" className="footer-brand brand">
            <div className="brand-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.5 2 6 4.5 6 7.5c0 2 1 3.7 2.5 4.7L8 16h8l-.5-3.8C17 11.2 18 9.5 18 7.5 18 4.5 15.5 2 12 2z" fill="white" fillOpacity="0.9"/>
                <rect x="9" y="17" width="6" height="1.5" rx="0.75" fill="white" fillOpacity="0.6"/>
                <rect x="9.5" y="19.5" width="5" height="1.5" rx="0.75" fill="white" fillOpacity="0.4"/>
              </svg>
            </div>
            <span className="brand-name">brainly</span>
          </a>
          <p className="footer-copy">© 2026 Brainly. Built for learners.</p>
          <div className="footer-links">
            <a href="/signup" className="footer-link">Get started</a>
            <a href="/signin" className="footer-link">Sign in</a>
          </div>
        </footer>
      </div>
    </>
  );
}