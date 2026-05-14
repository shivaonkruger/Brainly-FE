import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});

const signupUser = (data: FormFields) => api.post("/api/signup", data);

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Boldonse&family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #080808;
    --bg2: #0f0f0f;
    --glass: rgba(255,255,255,0.03);
    --glass-border: rgba(255,255,255,0.07);
    --glass-hover: rgba(255,255,255,0.06);
    --accent: #e0e0e0;
    --accent2: #a0a0a0;
    --accent-glow: rgba(255,255,255,0.08);
    --text: #f5f5f5;
    --muted: #555555;
    --muted2: #888888;
    --error: #f87171;
    --input-bg: rgba(255,255,255,0.04);
    --input-border: rgba(255,255,255,0.08);
    --input-focus: rgba(255,255,255,0.12);
  }

  .signup-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    display: flex;
    align-items: stretch;
    position: relative;
    overflow: hidden;
  }

  /* Ambient blobs */
  .blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(120px);
    pointer-events: none;
    z-index: 0;
  }
  .blob-1 {
    width: 600px; height: 600px;
    background: rgba(255,255,255,0.03);
    top: -200px; left: -100px;
    animation: drift1 18s ease-in-out infinite;
  }
  .blob-2 {
    width: 400px; height: 400px;
    background: rgba(255,255,255,0.02);
    bottom: -100px; right: 30%;
    animation: drift2 22s ease-in-out infinite;
  }
  .blob-3 {
    width: 300px; height: 300px;
    background: rgba(255,255,255,0.025);
    top: 40%; right: 10%;
    animation: drift1 15s ease-in-out infinite reverse;
  }

  @keyframes drift1 {
    0%,100% { transform: translate(0,0) scale(1); }
    33% { transform: translate(40px,-30px) scale(1.05); }
    66% { transform: translate(-20px,20px) scale(0.97); }
  }
  @keyframes drift2 {
    0%,100% { transform: translate(0,0) scale(1); }
    50% { transform: translate(-30px,30px) scale(1.08); }
  }

  /* Grid overlay */
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

  /* ─── LEFT PANEL ─── */
  .left-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 64px 72px;
    position: relative;
    z-index: 1;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 80px;
  }

  .brand-icon {
    width: 40px; height: 40px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
  }

  .brand-icon svg { width: 22px; height: 22px; }

  .brand-name {
    font-family: 'Boldonse', sans-serif;
    font-size: 22px;
    font-weight: 400;
    color: var(--text);
    letter-spacing: 0px;
  }

  .hero-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--muted2);
    margin-bottom: 24px;
    opacity: 0;
    animation: fadeUp 0.6s ease forwards 0.2s;
  }

  .hero-title {
    font-family: 'Boldonse', sans-serif;
    font-size: clamp(32px, 3.5vw, 48px);
    font-weight: 400;
    color: var(--text);
    line-height: 1.15;
    letter-spacing: 0px;
    margin-bottom: 24px;
    opacity: 0;
    animation: fadeUp 0.6s ease forwards 0.35s;
  }

  .hero-title span {
    background: linear-gradient(135deg, #ffffff, #888888);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-desc {
    font-size: 16px;
    color: var(--muted2);
    line-height: 1.7;
    max-width: 380px;
    font-weight: 300;
    opacity: 0;
    animation: fadeUp 0.6s ease forwards 0.5s;
  }

  .features {
    margin-top: 56px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    opacity: 0;
    animation: fadeUp 0.6s ease forwards 0.65s;
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .feature-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--muted2);
    flex-shrink: 0;
  }

  .feature-text {
    font-size: 14px;
    color: var(--muted2);
    font-weight: 400;
  }

  /* ─── DIVIDER ─── */
  .divider {
    width: 1px;
    background: linear-gradient(
      to bottom,
      transparent,
      var(--glass-border) 20%,
      var(--glass-border) 80%,
      transparent
    );
    position: relative;
    z-index: 1;
    flex-shrink: 0;
  }

  /* ─── RIGHT PANEL ─── */
  .right-panel {
    width: 480px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 40px;
    position: relative;
    z-index: 1;
  }

  .glass-card {
    width: 100%;
    background: var(--glass);
    border: 1px solid var(--glass-border);
    border-radius: 24px;
    padding: 48px 40px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow:
      0 0 0 1px rgba(255,255,255,0.04) inset,
      0 32px 64px rgba(0,0,0,0.4);
    opacity: 0;
    animation: fadeIn 0.7s ease forwards 0.3s;
  }

  .card-title {
    font-family: 'Syne', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.5px;
    margin-bottom: 6px;
  }

  .card-sub {
    font-size: 14px;
    color: var(--muted);
    margin-bottom: 36px;
    font-weight: 300;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: var(--muted2);
    letter-spacing: 0.5px;
    margin-bottom: 8px;
    text-transform: uppercase;
  }

  .input-wrap {
    position: relative;
  }

  .input-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--muted);
    display: flex; align-items: center;
    pointer-events: none;
  }

  .form-input {
    width: 100%;
    background: var(--input-bg);
    border: 1px solid var(--input-border);
    border-radius: 12px;
    padding: 13px 14px 13px 42px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }

  .form-input::placeholder { color: var(--muted); }

  .form-input:focus {
    border-color: rgba(255,255,255,0.3);
    background: rgba(255,255,255,0.06);
    box-shadow: 0 0 0 3px rgba(255,255,255,0.06);
  }

  .form-input.error {
    border-color: var(--error);
    box-shadow: 0 0 0 3px rgba(248,113,113,0.2);
  }

  .error-msg {
    font-size: 12px;
    color: var(--error);
    margin-top: 6px;
    padding-left: 2px;
  }

  .submit-btn {
    width: 100%;
    padding: 14px;
    background: #e8e8e8;
    border: none;
    border-radius: 12px;
    color: #0a0a0a;
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.3px;
    cursor: pointer;
    margin-top: 8px;
    position: relative;
    overflow: hidden;
    transition: opacity 0.2s, transform 0.15s, background 0.2s;
  }

  .submit-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .submit-btn:hover {
    background: #ffffff;
    transform: translateY(-1px);
  }

  .submit-btn:active { transform: translateY(0); }

  .submit-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
    pointer-events: none;
  }

  .signin-link {
    text-align: center;
    margin-top: 28px;
    font-size: 13px;
    color: var(--muted);
  }

  .signin-link a {
    color: var(--accent);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
  }

  .signin-link a:hover { color: #ffffff; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 900px) {
    .signup-root { flex-direction: column; }
    .left-panel { padding: 48px 32px 32px; }
    .divider { width: 100%; height: 1px; background: linear-gradient(to right, transparent, var(--glass-border) 20%, var(--glass-border) 80%, transparent); }
    .right-panel { width: 100%; padding: 32px 24px 48px; }
    .features { display: none; }
  }
`;

type FormFields = {
  username: string;
  email_id: string;
  password: string;
};

type FormErrors = Partial<Record<keyof FormFields, string>>;

export default function SignUp() {
  const [form, setForm] = useState<FormFields>({ username: "", email_id: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: signupUser,
    onSuccess: () => {
      window.location.href = "/signin";
    },
    onError: (err: AxiosError<{ message: string }>) => {
      const msg = err.response?.data?.message ?? "Something went wrong. Try again.";
      setServerError(msg);
    },
  });

  const validate = (): boolean => {
    const next: FormErrors = {};
    if (!form.username.trim()) next.username = "Username is required.";
    if (!form.email_id.trim()) next.email_id = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email_id)) next.email_id = "Enter a valid email.";
    if (!form.password) next.password = "Password is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormFields]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    if (serverError) setServerError(null);
  };

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (validate()) mutate(form);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="signup-root">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="grid-overlay" />

        {/* LEFT */}
        <div className="left-panel">
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

          <p className="hero-label">Your second brain</p>
          <h1 className="hero-title">
            <div>
                <div>Think less. </div>
                 <div className="p-3">Remember more.</div>
            </div>
            
          </h1>
          <p className="hero-desc">
            Capture ideas, build roadmaps, and offload your mental stack — all in one place.
          </p>

          <div className="features">
            {[
              "AI-generated learning roadmaps",
              "Smart daily todo from your goals",
              "Save anything to your second brain",
            ].map(f => (
              <div className="feature-item" key={f}>
                <div className="feature-dot" />
                <span className="feature-text">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* DIVIDER */}
        <div className="divider" />

        {/* RIGHT */}
        <div className="right-panel">
          <div className="glass-card">
            <h2 className="card-title">Create account</h2>
            <p className="card-sub">Start building your second brain today.</p>

            <div className="form-group">
              <label className="form-label">Username</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </span>
                <input
                  className={`form-input${errors.username ? " error" : ""}`}
                  type="text"
                  name="username"
                  placeholder="johndoe"
                  value={form.username}
                  onChange={handleChange}
                />
              </div>
              {errors.username && <p className="error-msg">{errors.username}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </span>
                <input
                  className={`form-input${errors.email_id ? " error" : ""}`}
                  type="email"
                  name="email_id"
                  placeholder="you@example.com"
                  value={form.email_id}
                  onChange={handleChange}
                />
              </div>
              {errors.email_id && <p className="error-msg">{errors.email_id}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrap">
                <span className="input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <input
                  className={`form-input${errors.password ? " error" : ""}`}
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
              {errors.password && <p className="error-msg">{errors.password}</p>}
            </div>

            <button className="submit-btn" onClick={handleSubmit} disabled={isPending}>
              {isPending ? "Creating account..." : "Create Account"}
            </button>

            {serverError && <p className="error-msg" style={{ textAlign: "center", marginTop: "12px" }}>{serverError}</p>}

            <p className="signin-link">
              Already have an account? <a href="/signin">Sign in</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}