const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #080808;
    --glass: rgba(255,255,255,0.03);
    --glass-border: rgba(255,255,255,0.07);
    --glass-hover: rgba(255,255,255,0.06);
    --text: #f5f5f5;
    --muted: #555555;
    --muted2: #888888;
  }

  .dashboard-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }

  .blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(120px);
    pointer-events: none;
    z-index: 0;
  }
  .blob-1 {
    width: 500px; height: 500px;
    background: rgba(255,255,255,0.025);
    top: -150px; left: -100px;
    animation: drift1 20s ease-in-out infinite;
  }
  .blob-2 {
    width: 400px; height: 400px;
    background: rgba(255,255,255,0.02);
    bottom: -100px; right: -80px;
    animation: drift2 24s ease-in-out infinite;
  }

  @keyframes drift1 {
    0%,100% { transform: translate(0,0) scale(1); }
    50% { transform: translate(30px,20px) scale(1.05); }
  }
  @keyframes drift2 {
    0%,100% { transform: translate(0,0) scale(1); }
    50% { transform: translate(-20px,-30px) scale(1.08); }
  }

  .grid-overlay {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
    background-size: 60px 60px;
    z-index: 0;
    pointer-events: none;
  }

  /* ─── NAVBAR ─── */
  .navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px 48px;
    position: relative;
    z-index: 2;
    border-bottom: 1px solid var(--glass-border);
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .brand-icon {
    width: 36px; height: 36px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
  }

  .brand-icon svg { width: 20px; height: 20px; }

  .brand-name {
    font-family: 'Syne', sans-serif;
    font-size: 20px;
    font-weight: 800;
    color: var(--text);
    letter-spacing: -0.5px;
  }

  .logout-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 18px;
    background: transparent;
    border: 1px solid rgba(248,113,113,0.25);
    border-radius: 10px;
    color: #f87171;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 400;
    cursor: pointer;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
  }

  .logout-btn:hover {
    border-color: rgba(248,113,113,0.5);
    color: #fca5a5;
    background: rgba(248,113,113,0.08);
  }

  /* ─── MAIN ─── */
  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 64px 48px;
    position: relative;
    z-index: 1;
  }

  .greeting-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--muted2);
    margin-bottom: 16px;
    opacity: 0;
    animation: fadeUp 0.5s ease forwards 0.1s;
  }

  .greeting-title {
    font-family: 'Syne', sans-serif;
    font-size: clamp(28px, 3vw, 42px);
    font-weight: 800;
    color: var(--text);
    letter-spacing: -1px;
    margin-bottom: 64px;
    opacity: 0;
    animation: fadeUp 0.5s ease forwards 0.2s;
  }

  .greeting-title span {
    background: linear-gradient(135deg, #ffffff, #666666);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ─── TILES ─── */
  .tiles {
    display: grid;
    grid-template-columns: repeat(3, 280px);
    gap: 20px;
  }

  .tile {
    background: var(--glass);
    border: 1px solid var(--glass-border);
    border-radius: 20px;
    padding: 36px 32px;
    cursor: pointer;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    gap: 20px;
    position: relative;
    overflow: hidden;
    transition: border-color 0.25s, background 0.25s, transform 0.2s;
    opacity: 0;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .tile:nth-child(1) { animation: fadeUp 0.5s ease forwards 0.3s; }
  .tile:nth-child(2) { animation: fadeUp 0.5s ease forwards 0.42s; }
  .tile:nth-child(3) { animation: fadeUp 0.5s ease forwards 0.54s; }

  .tile::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.04), transparent);
    opacity: 0;
    transition: opacity 0.25s;
    pointer-events: none;
  }

  .tile:hover {
    border-color: rgba(255,255,255,0.15);
    background: var(--glass-hover);
    transform: translateY(-4px);
  }

  .tile:hover::before { opacity: 1; }

  .tile-icon {
    width: 48px; height: 48px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    color: var(--text);
    flex-shrink: 0;
    transition: background 0.25s;
  }

  .tile:hover .tile-icon {
    background: rgba(255,255,255,0.1);
  }

  .tile-body { display: flex; flex-direction: column; gap: 8px; }

  .tile-title {
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.3px;
  }

  .tile-desc {
    font-size: 13px;
    color: var(--muted2);
    line-height: 1.6;
    font-weight: 300;
  }

  .tile-arrow {
    margin-top: auto;
    color: var(--muted);
    display: flex;
    align-items: center;
    transition: color 0.25s, transform 0.25s;
  }

  .tile:hover .tile-arrow {
    color: var(--text);
    transform: translateX(4px);
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 960px) {
    .tiles { grid-template-columns: repeat(2, 1fr); width: 100%; max-width: 600px; }
    .tile:nth-child(3) { grid-column: 1 / -1; }
  }

  @media (max-width: 600px) {
    .navbar { padding: 20px 24px; }
    .main { padding: 48px 24px; }
    .tiles { grid-template-columns: 1fr; max-width: 100%; }
    .tile:nth-child(3) { grid-column: auto; }
  }
`;

const tiles = [
  {
    href: "/content",
    title: "My Brain",
    desc: "Save links, ideas, and resources from across the web.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C8.5 2 6 4.5 6 7.5c0 2 1 3.7 2.5 4.7L8 16h8l-.5-3.8C17 11.2 18 9.5 18 7.5 18 4.5 15.5 2 12 2z"/>
        <line x1="9" y1="17" x2="15" y2="17"/>
        <line x1="9.5" y1="20" x2="14.5" y2="20"/>
      </svg>
    ),
  },
  {
    href: "/roadmap",
    title: "Roadmaps",
    desc: "AI-generated learning paths tailored to your goals.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 17l4-8 4 4 4-6 4 10"/>
        <path d="M3 17h18"/>
      </svg>
    ),
  },
  {
    href: "/todo",
    title: "Todos",
    desc: "Daily tasks and smart todos synced with your roadmap.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
  },
];

export default function Dashboard() {
  const username = (() => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.username as string;
    } catch {
      return null;
    }
  })();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/signin";
  };

  return (
    <>
      <style>{styles}</style>
      <div className="dashboard-root">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="grid-overlay" />

        {/* NAVBAR */}
        <nav className="navbar">
          <div className="brand">
            <div className="brand-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.5 2 6 4.5 6 7.5c0 2 1 3.7 2.5 4.7L8 16h8l-.5-3.8C17 11.2 18 9.5 18 7.5 18 4.5 15.5 2 12 2z" fill="white" fillOpacity="0.9"/>
                <rect x="9" y="17" width="6" height="1.5" rx="0.75" fill="white" fillOpacity="0.6"/>
                <rect x="9.5" y="19.5" width="5" height="1.5" rx="0.75" fill="white" fillOpacity="0.4"/>
              </svg>
            </div>
            <span className="brand-name">brainly</span>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Log out
          </button>
        </nav>

        {/* MAIN */}
        <main className="main">
          <p className="greeting-label">
            {username ? `Welcome back, ${username}` : "Welcome back"}
          </p>
          <h1 className="greeting-title">
            What are you<br />
            <span>working on?</span>
          </h1>

          <div className="tiles">
            {tiles.map(tile => (
              <a key={tile.href} href={tile.href} className="tile">
                <div className="tile-icon">{tile.icon}</div>
                <div className="tile-body">
                  <span className="tile-title">{tile.title}</span>
                  <span className="tile-desc">{tile.desc}</span>
                </div>
                <div className="tile-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}