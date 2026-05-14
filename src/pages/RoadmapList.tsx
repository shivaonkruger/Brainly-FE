import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

type Subtask = { _id: string; title: string; description: string; completed: boolean };
type Task = { _id: string; title: string; description: string; status: string; resources: string[]; subtasks: Subtask[] };
type Phase = { _id: string; title: string; tasks: Task[] };
type Roadmap = { _id: string; goal: string; hoursPerWeek: number; phases: Phase[]; createdAt: string };

type GenerateForm = {
  goal: string; category: string; currentLevel: string;
  timeAvailability: string; deadline: string; learningStyle: string; budget: string;
};

const EMPTY_FORM: GenerateForm = {
  goal: "", category: "", currentLevel: "", timeAvailability: "", deadline: "", learningStyle: "", budget: "",
};

const fetchRoadmaps = () =>
  api.get<{ roadmaps: Roadmap[] }>("/api/roadmap").then((r) => r.data.roadmaps);

const generateRoadmap = (data: GenerateForm) => api.post("/api/roadmap", data);
const deleteRoadmap = (id: string) => api.delete(`/api/roadmap/${id}`);

const getProgress = (phases: Phase[]) => {
  let total = 0, done = 0;
  phases.forEach((ph) => ph.tasks.forEach((t) => t.subtasks.forEach((s) => { total++; if (s.completed) done++; })));
  return { total, done, pct: total === 0 ? 0 : Math.round((done / total) * 100) };
};

const navItems = [
  { label: "My Brain", href: "/content", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8.5 2 6 4.5 6 7.5c0 2 1 3.7 2.5 4.7L8 16h8l-.5-3.8C17 11.2 18 9.5 18 7.5 18 4.5 15.5 2 12 2z"/><line x1="9" y1="17" x2="15" y2="17"/><line x1="9.5" y1="20" x2="14.5" y2="20"/></svg> },
  { label: "Roadmaps", href: "/roadmap", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l4-8 4 4 4-6 4 10"/><path d="M3 17h18"/></svg> },
  { label: "Todos", href: "/todo", icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #080808; --glass: rgba(255,255,255,0.03); --glass-border: rgba(255,255,255,0.07);
    --glass-hover: rgba(255,255,255,0.06); --text: #f5f5f5; --muted: #555555; --muted2: #888888;
    --error: #f87171; --sidebar-w: 220px;
  }
  .root { min-height: 100vh; background: var(--bg); font-family: 'DM Sans', sans-serif; display: flex; position: relative; overflow: hidden; }
  .blob { position: absolute; border-radius: 50%; filter: blur(120px); pointer-events: none; z-index: 0; }
  .blob-1 { width: 500px; height: 500px; background: rgba(255,255,255,0.025); top: -150px; right: 0; animation: drift1 20s ease-in-out infinite; }
  .blob-2 { width: 350px; height: 350px; background: rgba(255,255,255,0.018); bottom: -80px; left: 30%; animation: drift2 24s ease-in-out infinite; }
  @keyframes drift1 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-30px,20px); } }
  @keyframes drift2 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(20px,-20px); } }
  .grid-overlay { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px); background-size: 60px 60px; z-index: 0; pointer-events: none; }

  /* SIDEBAR */
  .sidebar { width: var(--sidebar-w); flex-shrink: 0; border-right: 1px solid var(--glass-border); display: flex; flex-direction: column; padding: 28px 16px; position: sticky; top: 0; height: 100vh; z-index: 10; background: rgba(8,8,8,0.7); backdrop-filter: blur(12px); }
  .brand-link { display: flex; align-items: center; gap: 10px; text-decoration: none; margin-bottom: 40px; padding: 0 8px; }
  .brand-icon { width: 34px; height: 34px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .brand-icon svg { width: 18px; height: 18px; }
  .brand-name { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: var(--text); letter-spacing: -0.5px; }
  .nav-label { font-size: 10px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); padding: 0 8px; margin-bottom: 8px; }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; text-decoration: none; color: var(--muted2); font-size: 14px; margin-bottom: 2px; transition: background 0.2s, color 0.2s; }
  .nav-item:hover { background: var(--glass-hover); color: var(--text); }
  .nav-item.active { background: rgba(255,255,255,0.07); color: var(--text); font-weight: 500; }
  .sidebar-bottom { margin-top: auto; }
  .logout-btn { display: flex; align-items: center; gap: 8px; width: 100%; padding: 10px 12px; background: transparent; border: 1px solid rgba(248,113,113,0.2); border-radius: 10px; color: #f87171; font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; transition: border-color 0.2s, background 0.2s, color 0.2s; }
  .logout-btn:hover { border-color: rgba(248,113,113,0.45); background: rgba(248,113,113,0.07); color: #fca5a5; }

  /* MAIN */
  .main { flex: 1; display: flex; flex-direction: column; position: relative; z-index: 1; overflow-y: auto; min-height: 100vh; }
  .topbar { display: flex; align-items: center; justify-content: space-between; padding: 28px 40px 0; }
  .page-title { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; color: var(--text); letter-spacing: -0.5px; }
  .add-btn { display: flex; align-items: center; gap: 8px; padding: 10px 20px; background: #e8e8e8; border: none; border-radius: 10px; color: #0a0a0a; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.2s, transform 0.15s; }
  .add-btn:hover { background: #fff; transform: translateY(-1px); }
  .add-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  /* CARDS */
  .cards-area { padding: 32px 40px 48px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; align-content: start; }
  .card { background: var(--glass); border: 1px solid var(--glass-border); border-radius: 16px; padding: 24px; display: flex; flex-direction: column; gap: 14px; cursor: pointer; text-decoration: none; transition: border-color 0.2s, background 0.2s, transform 0.2s; animation: fadeUp 0.4s ease forwards; opacity: 0; }
  .card:hover { border-color: rgba(255,255,255,0.13); background: var(--glass-hover); transform: translateY(-2px); }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  .card-goal { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: var(--text); letter-spacing: -0.2px; line-height: 1.4; }
  .card-meta { display: flex; align-items: center; gap: 12px; }
  .meta-pill { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--muted2); }
  .progress-wrap { display: flex; flex-direction: column; gap: 6px; margin-top: 4px; }
  .progress-label { display: flex; justify-content: space-between; font-size: 11px; color: var(--muted2); }
  .progress-bar-bg { width: 100%; height: 3px; background: rgba(255,255,255,0.07); border-radius: 99px; overflow: hidden; }
  .progress-bar-fill { height: 100%; background: #e8e8e8; border-radius: 99px; transition: width 0.4s ease; }
  .card-footer { display: flex; align-items: center; justify-content: space-between; }
  .card-date { font-size: 11px; color: var(--muted); }
  .delete-btn { width: 28px; height: 28px; border-radius: 7px; border: 1px solid var(--glass-border); background: transparent; color: var(--muted2); display: flex; align-items: center; justify-content: center; cursor: pointer; opacity: 0; transition: opacity 0.2s, background 0.15s, color 0.15s, border-color 0.15s; }
  .card:hover .delete-btn { opacity: 1; }
  .delete-btn:hover { background: rgba(248,113,113,0.1); color: #f87171; border-color: rgba(248,113,113,0.3); }

  /* EMPTY */
  .empty { grid-column: 1/-1; display: flex; flex-direction: column; align-items: center; padding: 80px 40px; gap: 16px; }
  .empty-icon { color: var(--muted); opacity: 0.4; }
  .empty-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; color: var(--text); }
  .empty-desc { font-size: 14px; color: var(--muted2); font-weight: 300; }

  /* MODAL */
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(6px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 24px; animation: fadeIn 0.2s ease; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal { width: 100%; max-width: 520px; background: #111; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 36px; box-shadow: 0 32px 64px rgba(0,0,0,0.6); animation: slideUp 0.25s ease; max-height: 90vh; overflow-y: auto; }
  @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  .modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .modal-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; color: var(--text); letter-spacing: -0.3px; }
  .modal-sub { font-size: 13px; color: var(--muted2); font-weight: 300; margin-bottom: 28px; }
  .close-btn { width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--glass-border); background: transparent; color: var(--muted2); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.15s, color 0.15s; flex-shrink: 0; }
  .close-btn:hover { background: rgba(255,255,255,0.06); color: var(--text); }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .form-group { margin-bottom: 16px; }
  .form-label { display: block; font-size: 11px; font-weight: 500; color: var(--muted2); letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 8px; }
  .form-input, .form-select { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 11px 14px; font-size: 14px; font-family: 'DM Sans', sans-serif; color: var(--text); outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
  .form-input::placeholder { color: var(--muted); }
  .form-input:focus, .form-select:focus { border-color: rgba(255,255,255,0.25); box-shadow: 0 0 0 3px rgba(255,255,255,0.05); }
  .form-input.error, .form-select.error { border-color: var(--error); }
  .form-select option { background: #111; color: var(--text); }
  .error-msg { font-size: 12px; color: var(--error); margin-top: 5px; }
  .modal-footer { display: flex; gap: 10px; margin-top: 8px; }
  .btn-primary { flex: 1; padding: 12px; background: #e8e8e8; border: none; border-radius: 10px; color: #0a0a0a; font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
  .btn-primary:hover { background: #fff; }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-ghost { padding: 12px 20px; background: transparent; border: 1px solid var(--glass-border); border-radius: 10px; color: var(--muted2); font-family: 'DM Sans', sans-serif; font-size: 14px; cursor: pointer; transition: background 0.2s, color 0.2s; }
  .btn-ghost:hover { background: rgba(255,255,255,0.05); color: var(--text); }
  .server-error { font-size: 13px; color: var(--error); text-align: center; margin-top: 8px; }
  .generating-hint { font-size: 12px; color: var(--muted); text-align: center; margin-top: 8px; }
`;

export default function RoadmapList() {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<GenerateForm>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Partial<GenerateForm>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const { data: roadmaps = [], isLoading } = useQuery({
    queryKey: ["roadmaps"],
    queryFn: fetchRoadmaps,
  });

  const { mutate: generate, isPending: generating } = useMutation({
    mutationFn: () => generateRoadmap(form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["roadmaps"] }); closeModal(); },
    onError: (err: AxiosError<{ message: string }>) => {
      setServerError(err.response?.data?.message ?? "Something went wrong.");
    },
  });

  const { mutate: remove } = useMutation({
    mutationFn: (id: string) => deleteRoadmap(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["roadmaps"] }),
  });

  const openModal = () => { setForm(EMPTY_FORM); setFormErrors({}); setServerError(null); setModalOpen(true); };
  const closeModal = () => setModalOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (formErrors[name as keyof GenerateForm]) setFormErrors((p) => ({ ...p, [name]: undefined }));
    if (serverError) setServerError(null);
  };

  const validate = () => {
    const errs: Partial<GenerateForm> = {};
    if (!form.goal.trim()) errs.goal = "Required.";
    if (!form.category.trim()) errs.category = "Required.";
    if (!form.currentLevel.trim()) errs.currentLevel = "Required.";
    if (!form.timeAvailability.trim()) errs.timeAvailability = "Required.";
    if (!form.deadline.trim()) errs.deadline = "Required.";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => { if (validate()) generate(); };
  const handleLogout = () => { localStorage.removeItem("token"); window.location.href = "/signin"; };

  return (
    <>
      <style>{styles}</style>
      <div className="root">
        <div className="blob blob-1" /><div className="blob blob-2" />
        <div className="grid-overlay" />

        {/* SIDEBAR */}
        <aside className="sidebar">
          <a href="/dashboard" className="brand-link">
            <div className="brand-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.5 2 6 4.5 6 7.5c0 2 1 3.7 2.5 4.7L8 16h8l-.5-3.8C17 11.2 18 9.5 18 7.5 18 4.5 15.5 2 12 2z" fill="white" fillOpacity="0.9"/>
                <rect x="9" y="17" width="6" height="1.5" rx="0.75" fill="white" fillOpacity="0.6"/>
                <rect x="9.5" y="19.5" width="5" height="1.5" rx="0.75" fill="white" fillOpacity="0.4"/>
              </svg>
            </div>
            <span className="brand-name">brainly</span>
          </a>
          <p className="nav-label">Navigation</p>
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className={`nav-item${item.href === "/roadmap" ? " active" : ""}`}>
              <span>{item.icon}</span>{item.label}
            </a>
          ))}
          <div className="sidebar-bottom">
            <button className="logout-btn" onClick={handleLogout}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Log out
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <div className="main">
          <div className="topbar">
            <h1 className="page-title">Roadmaps</h1>
            <button className="add-btn" onClick={openModal} disabled={generating}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Generate Roadmap
            </button>
          </div>

          <div className="cards-area">
            {isLoading ? (
              <div className="empty"><p className="empty-desc">Loading...</p></div>
            ) : roadmaps.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l4-8 4 4 4-6 4 10"/><path d="M3 17h18"/></svg>
                </div>
                <p className="empty-title">No roadmaps yet</p>
                <p className="empty-desc">Generate your first AI learning roadmap.</p>
              </div>
            ) : (
              roadmaps.map((r, i) => {
                const { total, done, pct } = getProgress(r.phases);
                return (
                  <a
                    key={r._id}
                    className="card"
                    href={`/roadmap/${r._id}`}
                    style={{ animationDelay: `${i * 0.05}s` }}
                    onClick={(e) => { if ((e.target as HTMLElement).closest(".delete-btn")) e.preventDefault(); }}
                  >
                    <p className="card-goal">{r.goal}</p>

                    <div className="card-meta">
                      <span className="meta-pill">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {r.hoursPerWeek}h / week
                      </span>
                      <span className="meta-pill">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                        {r.phases.length} phases
                      </span>
                    </div>

                    <div className="progress-wrap">
                      <div className="progress-label">
                        <span>Progress</span>
                        <span>{done}/{total} subtasks · {pct}%</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                      </div>
                    </div>

                    <div className="card-footer">
                      <span className="card-date">{new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      <button
                        className="delete-btn"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); remove(r._id); }}
                        title="Delete"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                      </button>
                    </div>
                  </a>
                );
              })
            )}
          </div>
        </div>

        {/* MODAL */}
        {modalOpen && (
          <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
            <div className="modal">
              <div className="modal-header">
                <h2 className="modal-title">Generate Roadmap</h2>
                <button className="close-btn" onClick={closeModal}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <p className="modal-sub">Tell us about your goal and we'll build a structured learning plan.</p>

              <div className="form-group">
                <label className="form-label">Goal</label>
                <input className={`form-input${formErrors.goal ? " error" : ""}`} name="goal" placeholder="e.g. Become a full-stack developer" value={form.goal} onChange={handleChange} />
                {formErrors.goal && <p className="error-msg">{formErrors.goal}</p>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input className={`form-input${formErrors.category ? " error" : ""}`} name="category" placeholder="e.g. Web Development" value={form.category} onChange={handleChange} />
                  {formErrors.category && <p className="error-msg">{formErrors.category}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label">Current Level</label>
                  <select className={`form-select${formErrors.currentLevel ? " error" : ""}`} name="currentLevel" value={form.currentLevel} onChange={handleChange}>
                    <option value="">Select...</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  {formErrors.currentLevel && <p className="error-msg">{formErrors.currentLevel}</p>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Hours / Week</label>
                  <input className={`form-input${formErrors.timeAvailability ? " error" : ""}`} name="timeAvailability" placeholder="e.g. 10" value={form.timeAvailability} onChange={handleChange} />
                  {formErrors.timeAvailability && <p className="error-msg">{formErrors.timeAvailability}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label">Deadline</label>
                  <input className={`form-input${formErrors.deadline ? " error" : ""}`} name="deadline" type="date" value={form.deadline} onChange={handleChange} />
                  {formErrors.deadline && <p className="error-msg">{formErrors.deadline}</p>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Learning Style</label>
                  <select className="form-select" name="learningStyle" value={form.learningStyle} onChange={handleChange}>
                    <option value="">Select...</option>
                    <option value="visual">Visual</option>
                    <option value="reading">Reading</option>
                    <option value="hands-on">Hands-on</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Budget</label>
                  <select className="form-select" name="budget" value={form.budget} onChange={handleChange}>
                    <option value="">Select...</option>
                    <option value="free">Free only</option>
                    <option value="low">Low (&lt;$50)</option>
                    <option value="medium">Medium ($50–200)</option>
                    <option value="high">No limit</option>
                  </select>
                </div>
              </div>

              {serverError && <p className="server-error">{serverError}</p>}

              <div className="modal-footer">
                <button className="btn-ghost" onClick={closeModal}>Cancel</button>
                <button className="btn-primary" onClick={handleSubmit} disabled={generating}>
                  {generating ? "Generating..." : "Generate"}
                </button>
              </div>
              {generating && <p className="generating-hint">This may take a few seconds — AI is building your roadmap.</p>}
            </div>
          </div>
        )}
      </div>
    </>
  );
}