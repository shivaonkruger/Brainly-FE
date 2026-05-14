import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

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

const fetchRoadmap = (id: string) =>
  api.get<{ roadmap: Roadmap }>(`/api/roadmap/${id}`).then((r) => r.data.roadmap);

const updateRoadmap = (id: string, data: { goal: string; phases: Phase[] }) =>
  api.put(`/api/roadmap/${id}`, data);

const getProgress = (phases: Phase[]) => {
  let total = 0, done = 0;
  phases.forEach((ph) => ph.tasks.forEach((t) => t.subtasks.forEach((s) => { total++; if (s.completed) done++; })));
  return { total, done, pct: total === 0 ? 0 : Math.round((done / total) * 100) };
};

const id = window.location.pathname.split("/").pop() ?? "";

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
    --sidebar-w: 220px;
  }
  .root { min-height: 100vh; background: var(--bg); font-family: 'DM Sans', sans-serif; display: flex; position: relative; overflow: hidden; }
  .blob { position: absolute; border-radius: 50%; filter: blur(120px); pointer-events: none; z-index: 0; }
  .blob-1 { width: 500px; height: 500px; background: rgba(255,255,255,0.025); top: -150px; right: 0; animation: drift1 20s ease-in-out infinite; }
  .blob-2 { width: 350px; height: 350px; background: rgba(255,255,255,0.018); bottom: -80px; left: 30%; animation: drift2 24s ease-in-out infinite; }
  @keyframes drift1 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-30px,20px); } }
  @keyframes drift2 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(20px,-20px); } }
  .grid-overlay { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px); background-size: 60px 60px; z-index: 0; pointer-events: none; }

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

  .main { flex: 1; display: flex; flex-direction: column; position: relative; z-index: 1; overflow-y: auto; min-height: 100vh; }

  .topbar { display: flex; align-items: center; gap: 16px; padding: 28px 40px 0; }
  .back-btn { display: flex; align-items: center; gap: 6px; color: var(--muted2); font-size: 13px; text-decoration: none; padding: 7px 12px; border: 1px solid var(--glass-border); border-radius: 9px; transition: color 0.2s, background 0.2s; }
  .back-btn:hover { color: var(--text); background: var(--glass-hover); }

  .header-area { padding: 24px 40px 0; }
  .roadmap-goal { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: var(--text); letter-spacing: -0.8px; line-height: 1.25; margin-bottom: 12px; }
  .roadmap-meta { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
  .meta-pill { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--muted2); }

  .overall-progress { background: var(--glass); border: 1px solid var(--glass-border); border-radius: 12px; padding: 16px 20px; display: flex; align-items: center; gap: 20px; margin-bottom: 8px; }
  .progress-label-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .progress-label-text { font-size: 12px; color: var(--muted2); }
  .progress-pct { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: var(--text); }
  .progress-bar-bg { flex: 1; height: 4px; background: rgba(255,255,255,0.07); border-radius: 99px; overflow: hidden; }
  .progress-bar-fill { height: 100%; background: #e8e8e8; border-radius: 99px; transition: width 0.5s ease; }

  .phases-area { padding: 24px 40px 48px; display: flex; flex-direction: column; gap: 12px; }

  .phase-card { background: var(--glass); border: 1px solid var(--glass-border); border-radius: 14px; overflow: hidden; transition: border-color 0.2s; }
  .phase-card.open { border-color: rgba(255,255,255,0.12); }

  .phase-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 22px; cursor: pointer; user-select: none; }
  .phase-header:hover { background: rgba(255,255,255,0.02); }
  .phase-left { display: flex; align-items: center; gap: 12px; }
  .phase-num { width: 26px; height: 26px; border-radius: 7px; background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700; color: var(--muted2); flex-shrink: 0; }
  .phase-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: var(--text); letter-spacing: -0.2px; }
  .phase-right { display: flex; align-items: center; gap: 12px; }
  .phase-tasks-count { font-size: 12px; color: var(--muted); }
  .chevron { color: var(--muted); transition: transform 0.25s; }
  .chevron.open { transform: rotate(180deg); }

  .phase-body { border-top: 1px solid var(--glass-border); padding: 0 22px 18px; display: flex; flex-direction: column; gap: 16px; animation: fadeIn 0.2s ease; padding-top: 18px; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .task-block { display: flex; flex-direction: column; gap: 10px; }
  .task-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
  .task-title { font-size: 14px; font-weight: 600; color: var(--text); }
  .task-desc { font-size: 13px; color: var(--muted2); line-height: 1.6; font-weight: 300; }
  .task-status { font-size: 11px; padding: 3px 8px; border-radius: 6px; font-weight: 500; flex-shrink: 0; }
  .task-status.completed { background: rgba(255,255,255,0.07); color: var(--muted2); }
  .task-status.pending { background: rgba(255,255,255,0.04); color: var(--muted); }

  .resources { display: flex; flex-wrap: wrap; gap: 6px; }
  .resource-link { display: flex; align-items: center; gap: 4px; font-size: 11px; color: var(--muted2); text-decoration: none; padding: 3px 8px; border: 1px solid var(--glass-border); border-radius: 6px; transition: color 0.15s, border-color 0.15s; }
  .resource-link:hover { color: var(--text); border-color: rgba(255,255,255,0.15); }

  .subtasks { display: flex; flex-direction: column; gap: 6px; padding-left: 2px; }
  .subtask-row { display: flex; align-items: flex-start; gap: 10px; padding: 8px 10px; border-radius: 8px; transition: background 0.15s; }
  .subtask-row:hover { background: rgba(255,255,255,0.03); }
  .subtask-check { width: 16px; height: 16px; border-radius: 4px; border: 1.5px solid rgba(255,255,255,0.2); background: transparent; flex-shrink: 0; cursor: pointer; display: flex; align-items: center; justify-content: center; margin-top: 1px; transition: background 0.15s, border-color 0.15s; }
  .subtask-check.checked { background: #e8e8e8; border-color: #e8e8e8; }
  .subtask-text { flex: 1; }
  .subtask-title { font-size: 13px; color: var(--text); font-weight: 400; line-height: 1.4; }
  .subtask-title.done { color: var(--muted); text-decoration: line-through; }
  .subtask-desc { font-size: 12px; color: var(--muted); margin-top: 2px; line-height: 1.5; font-weight: 300; }

  .task-divider { height: 1px; background: var(--glass-border); margin: 4px 0; }

  .loading-state { display: flex; align-items: center; justify-content: center; flex: 1; padding: 80px; color: var(--muted2); font-size: 14px; }
`;

export default function RoadmapDetail() {
  const qc = useQueryClient();
  const [openPhases, setOpenPhases] = useState<Set<string>>(new Set());

  const { data: roadmap, isLoading } = useQuery({
    queryKey: ["roadmap", id],
    queryFn: () => fetchRoadmap(id),
    enabled: !!id,
  });

  const { mutate: save } = useMutation({
    mutationFn: (phases: Phase[]) => updateRoadmap(id, { goal: roadmap!.goal, phases }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["roadmap", id] }),
  });

  const togglePhase = (phaseId: string) => {
    setOpenPhases((prev) => {
      const next = new Set(prev);
      next.has(phaseId) ? next.delete(phaseId) : next.add(phaseId);
      return next;
    });
  };

  const toggleSubtask = (phaseIdx: number, taskIdx: number, subtaskIdx: number) => {
    if (!roadmap) return;
    const phases = JSON.parse(JSON.stringify(roadmap.phases)) as Phase[];
    const sub = phases[phaseIdx].tasks[taskIdx].subtasks[subtaskIdx];
    sub.completed = !sub.completed;
    const allDone = phases[phaseIdx].tasks[taskIdx].subtasks.every((s) => s.completed);
    phases[phaseIdx].tasks[taskIdx].status = allDone ? "completed" : "pending";
    save(phases);
  };

  const handleLogout = () => { localStorage.removeItem("token"); window.location.href = "/signin"; };

  const progress = roadmap ? getProgress(roadmap.phases) : { total: 0, done: 0, pct: 0 };

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
          {isLoading || !roadmap ? (
            <div className="loading-state">Loading roadmap...</div>
          ) : (
            <>
              <div className="topbar">
                <a href="/roadmap" className="back-btn">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                  Back to Roadmaps
                </a>
              </div>

              <div className="header-area">
                <h1 className="roadmap-goal">{roadmap.goal}</h1>
                <div className="roadmap-meta">
                  <span className="meta-pill">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {roadmap.hoursPerWeek}h / week
                  </span>
                  <span className="meta-pill">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                    {roadmap.phases.length} phases
                  </span>
                  <span className="meta-pill">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    {new Date(roadmap.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>

                <div className="overall-progress">
                  <span className="progress-pct">{progress.pct}%</span>
                  <div style={{ flex: 1 }}>
                    <div className="progress-label-row">
                      <span className="progress-label-text">Overall Progress</span>
                      <span className="progress-label-text">{progress.done} / {progress.total} subtasks</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: `${progress.pct}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="phases-area">
                {roadmap.phases.map((phase, phaseIdx) => {
                  const isOpen = openPhases.has(phase._id);
                  const taskCount = phase.tasks.length;
                  const doneCount = phase.tasks.filter((t) => t.status === "completed").length;
                  return (
                    <div key={phase._id} className={`phase-card${isOpen ? " open" : ""}`}>
                      <div className="phase-header" onClick={() => togglePhase(phase._id)}>
                        <div className="phase-left">
                          <div className="phase-num">{phaseIdx + 1}</div>
                          <span className="phase-title">{phase.title}</span>
                        </div>
                        <div className="phase-right">
                          <span className="phase-tasks-count">{doneCount}/{taskCount} tasks</span>
                          <svg className={`chevron${isOpen ? " open" : ""}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                        </div>
                      </div>

                      {isOpen && (
                        <div className="phase-body">
                          {phase.tasks.map((task, taskIdx) => (
                            <div key={task._id} className="task-block">
                              {taskIdx > 0 && <div className="task-divider" />}
                              <div className="task-header">
                                <div>
                                  <p className="task-title">{task.title}</p>
                                  <p className="task-desc">{task.description}</p>
                                </div>
                                <span className={`task-status ${task.status}`}>{task.status}</span>
                              </div>

                              {task.resources.length > 0 && (
                                <div className="resources">
                                  {task.resources.map((r, ri) => (
                                    <a key={ri} href={r} target="_blank" rel="noreferrer" className="resource-link">
                                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                      Resource {ri + 1}
                                    </a>
                                  ))}
                                </div>
                              )}

                              {task.subtasks.length > 0 && (
                                <div className="subtasks">
                                  {task.subtasks.map((sub, subIdx) => (
                                    <div key={sub._id} className="subtask-row">
                                      <div
                                        className={`subtask-check${sub.completed ? " checked" : ""}`}
                                        onClick={() => toggleSubtask(phaseIdx, taskIdx, subIdx)}
                                      >
                                        {sub.completed && (
                                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                        )}
                                      </div>
                                      <div className="subtask-text">
                                        <p className={`subtask-title${sub.completed ? " done" : ""}`}>{sub.title}</p>
                                        {sub.description && <p className="subtask-desc">{sub.description}</p>}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}