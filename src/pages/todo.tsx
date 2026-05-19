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

type TodoTask = {
  description: string;
  completed: boolean;
  roadmapId?: string;
  phaseId?: string;
  taskId?: string;
  subtaskId?: string;
};

type Todo = {
  _id: string;
  title: string;
  isSmartTodo: boolean;
  tasks: TodoTask[];
  createdAt: string;
};

type ManualForm = { title: string; tasks: string[] };
const EMPTY_FORM: ManualForm = { title: "", tasks: [""] };

const fetchTodos = () =>
  api.get<{ todos: Todo[] }>("/api/todo").then((r) => r.data.todos);

const createTodo = (data: { title: string; tasks: { description: string }[] }) =>
  api.post("/api/todo", data);

const generateSmartTodo = () => api.post("/api/todo/smarttodo");

const updateTodo = (id: string, data: { title: string; tasks: TodoTask[] }) =>
  api.put(`/api/todo/${id}`, data);

const deleteTodo = (id: string) => api.delete(`/api/todo/${id}`);

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
  @keyframes drift1 { 0%,100% { transform:translate(0,0); } 50% { transform:translate(-30px,20px); } }
  @keyframes drift2 { 0%,100% { transform:translate(0,0); } 50% { transform:translate(20px,-20px); } }
  .grid-overlay { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px); background-size: 60px 60px; z-index: 0; pointer-events: none; }

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
  .topbar { display: flex; align-items: center; justify-content: space-between; padding: 28px 40px 0; }
  .page-title { font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; color: var(--text); letter-spacing: -0.5px; }
  .topbar-actions { display: flex; align-items: center; gap: 10px; }

  .btn-smart { display: flex; align-items: center; gap: 7px; padding: 10px 18px; background: transparent; border: 1px solid rgba(255,255,255,0.12); border-radius: 10px; color: var(--text); font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.2s, border-color 0.2s, transform 0.15s; }
  .btn-smart:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.2); transform: translateY(-1px); }
  .btn-smart:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

  .btn-primary { display: flex; align-items: center; gap: 7px; padding: 10px 20px; background: #e8e8e8; border: none; border-radius: 10px; color: #0a0a0a; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.2s, transform 0.15s; }
  .btn-primary:hover { background: #fff; transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .todos-area { padding: 32px 40px 48px; display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-content: start; }
  .section-label { font-size: 10px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-bottom: 12px; }

  .todo-card { background: var(--glass); border: 1px solid var(--glass-border); border-radius: 16px; padding: 22px 24px; display: flex; flex-direction: column; gap: 14px; animation: fadeUp 0.35s ease forwards; opacity: 0; }
  .todo-card.smart-card { border-color: rgba(255,255,255,0.1); }
  @keyframes fadeUp { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }

  .todo-card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
  .todo-card-title-wrap { display: flex; flex-direction: column; gap: 6px; }
  .todo-card-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: var(--text); letter-spacing: -0.2px; }
  .smart-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; color: var(--muted2); background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); padding: 2px 8px; border-radius: 6px; width: fit-content; }
  .todo-card-actions { display: flex; gap: 4px; flex-shrink: 0; }
  .icon-btn { width: 28px; height: 28px; border-radius: 7px; border: 1px solid var(--glass-border); background: transparent; color: var(--muted2); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.15s, color 0.15s, border-color 0.15s; }
  .icon-btn.del:hover { background: rgba(248,113,113,0.1); color: #f87171; border-color: rgba(248,113,113,0.3); }

  .task-list { display: flex; flex-direction: column; gap: 4px; }
  .task-row { display: flex; align-items: flex-start; gap: 10px; padding: 7px 8px; border-radius: 8px; cursor: pointer; transition: background 0.15s; }
  .task-row:hover { background: rgba(255,255,255,0.03); }
  .task-check { width: 16px; height: 16px; border-radius: 4px; border: 1.5px solid rgba(255,255,255,0.2); background: transparent; flex-shrink: 0; display: flex; align-items: center; justify-content: center; margin-top: 1px; transition: background 0.15s, border-color 0.15s; }
  .task-check.checked { background: #e8e8e8; border-color: #e8e8e8; }
  .task-desc { font-size: 13px; color: var(--text); line-height: 1.5; }
  .task-desc.done { color: var(--muted); text-decoration: line-through; }
  .task-sync-hint { font-size: 11px; color: var(--muted); margin-top: 2px; }

  .todo-footer { display: flex; align-items: center; justify-content: space-between; }
  .todo-date { font-size: 11px; color: var(--muted); }
  .progress-mini { display: flex; align-items: center; gap: 8px; }
  .progress-mini-bar-bg { width: 60px; height: 3px; background: rgba(255,255,255,0.07); border-radius: 99px; overflow: hidden; }
  .progress-mini-bar-fill { height: 100%; background: #e8e8e8; border-radius: 99px; transition: width 0.3s; }
  .progress-mini-text { font-size: 11px; color: var(--muted2); }

  .empty-col { display: flex; flex-direction: column; align-items: center; padding: 48px 24px; gap: 10px; background: var(--glass); border: 1px dashed rgba(255,255,255,0.06); border-radius: 16px; }
  .empty-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: var(--muted2); }
  .empty-desc { font-size: 12px; color: var(--muted); font-weight: 300; text-align: center; }

  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(6px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 24px; animation: fadeInBg 0.2s ease; }
  @keyframes fadeInBg { from { opacity:0; } to { opacity:1; } }
  .modal { width: 100%; max-width: 460px; background: #111; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 36px; box-shadow: 0 32px 64px rgba(0,0,0,0.6); animation: slideUp 0.25s ease; }
  @keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  .modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
  .modal-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; color: var(--text); letter-spacing: -0.3px; }
  .close-btn { width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--glass-border); background: transparent; color: var(--muted2); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.15s, color 0.15s; }
  .close-btn:hover { background: rgba(255,255,255,0.06); color: var(--text); }
  .form-group { margin-bottom: 16px; }
  .form-label { display: block; font-size: 11px; font-weight: 500; color: var(--muted2); letter-spacing: 0.8px; text-transform: uppercase; margin-bottom: 8px; }
  .form-input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 11px 14px; font-size: 14px; font-family: 'DM Sans', sans-serif; color: var(--text); outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
  .form-input::placeholder { color: var(--muted); }
  .form-input:focus { border-color: rgba(255,255,255,0.25); box-shadow: 0 0 0 3px rgba(255,255,255,0.05); }
  .form-input.error { border-color: var(--error); }
  .error-msg { font-size: 12px; color: var(--error); margin-top: 5px; }
  .task-inputs { display: flex; flex-direction: column; gap: 8px; }
  .task-input-row { display: flex; align-items: center; gap: 8px; }
  .task-input-row .form-input { flex: 1; }
  .remove-task-btn { width: 28px; height: 28px; border-radius: 7px; border: 1px solid var(--glass-border); background: transparent; color: var(--muted); display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0; transition: color 0.15s, background 0.15s; }
  .remove-task-btn:hover { color: #f87171; background: rgba(248,113,113,0.08); border-color: rgba(248,113,113,0.25); }
  .add-task-row { display: flex; align-items: center; gap: 6px; margin-top: 4px; color: var(--muted2); font-size: 13px; cursor: pointer; padding: 6px 4px; border-radius: 7px; transition: color 0.15s; width: fit-content; }
  .add-task-row:hover { color: var(--text); }
  .modal-footer { display: flex; gap: 10px; margin-top: 24px; }
  .btn-modal-primary { flex: 1; padding: 12px; background: #e8e8e8; border: none; border-radius: 10px; color: #0a0a0a; font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
  .btn-modal-primary:hover { background: #fff; }
  .btn-modal-primary:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-ghost { padding: 12px 20px; background: transparent; border: 1px solid var(--glass-border); border-radius: 10px; color: var(--muted2); font-family: 'DM Sans', sans-serif; font-size: 14px; cursor: pointer; transition: background 0.2s, color 0.2s; }
  .btn-ghost:hover { background: rgba(255,255,255,0.05); color: var(--text); }
  .server-error { font-size: 13px; color: var(--error); text-align: center; margin-top: 8px; }
`;

export default function TodoPage() {
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<ManualForm>(EMPTY_FORM);
  const [titleError, setTitleError] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);

  const { data: todos = [], isLoading } = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["todos"] });

  const { mutate: create, isPending: creating } = useMutation({
    mutationFn: () =>
      createTodo({ title: form.title, tasks: form.tasks.filter(Boolean).map((d) => ({ description: d })) }),
    onSuccess: () => { invalidate(); closeModal(); },
    onError: (err: AxiosError<{ message: string }>) =>
      setServerError(err.response?.data?.message ?? "Something went wrong."),
  });

  const { mutate: smartGenerate, isPending: smartGenerating } = useMutation({
    mutationFn: generateSmartTodo,
    onSuccess: () => invalidate(),
    onError: (err: AxiosError<{ message: string }>) => {
      alert(err.response?.data?.message ?? "Could not generate smart todo.");
    },
  });

  const { mutate: toggleTask } = useMutation({
    mutationFn: ({ todo, idx }: { todo: Todo; idx: number }) => {
      const tasks = todo.tasks.map((t, i) =>
        i === idx ? { ...t, completed: !t.completed } : t
      );
      return updateTodo(todo._id, { title: todo.title, tasks });
    },
    onSuccess: () => invalidate(),
  });

  const { mutate: remove } = useMutation({
    mutationFn: (id: string) => deleteTodo(id),
    onSuccess: () => invalidate(),
  });

  const openModal = () => { setForm(EMPTY_FORM); setTitleError(""); setServerError(null); setModalOpen(true); };
  const closeModal = () => setModalOpen(false);

  const handleTitleChange = (v: string) => {
    setForm((p) => ({ ...p, title: v }));
    if (titleError) setTitleError("");
    if (serverError) setServerError(null);
  };
  const handleTaskChange = (i: number, v: string) =>
    setForm((p) => { const tasks = [...p.tasks]; tasks[i] = v; return { ...p, tasks }; });
  const addTaskInput = () => setForm((p) => ({ ...p, tasks: [...p.tasks, ""] }));
  const removeTaskInput = (i: number) =>
    setForm((p) => ({ ...p, tasks: p.tasks.filter((_, idx) => idx !== i) }));

  const handleSubmit = () => {
    if (!form.title.trim()) { setTitleError("Title is required."); return; }
    create();
  };

  const handleLogout = () => { localStorage.removeItem("token"); window.location.href = "/signin"; };

  const smartTodos = todos.filter((t) => t.isSmartTodo);
  const manualTodos = todos.filter((t) => !t.isSmartTodo);
  const doneCount = (todo: Todo) => todo.tasks.filter((t) => t.completed).length;
  const pct = (todo: Todo) =>
    todo.tasks.length === 0 ? 0 : Math.round((doneCount(todo) / todo.tasks.length) * 100);

  const TrashIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
    </svg>
  );

  const CheckIcon = () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );

  const renderTodoCard = (todo: Todo, i: number) => {
    const done = doneCount(todo);
    const total = todo.tasks.length;
    const p = pct(todo);
    return (
      <div
        key={todo._id}
        className={`todo-card${todo.isSmartTodo ? " smart-card" : ""}`}
        style={{ animationDelay: `${i * 0.05}s` }}
      >
        <div className="todo-card-header">
          <div className="todo-card-title-wrap">
            {todo.isSmartTodo && (
              <span className="smart-badge">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                AI Generated
              </span>
            )}
            <span className="todo-card-title">{todo.title}</span>
          </div>
          <div className="todo-card-actions">
            <button className="icon-btn del" onClick={() => remove(todo._id)} title="Delete">
              <TrashIcon />
            </button>
          </div>
        </div>

        <div className="task-list">
          {total === 0 ? (
            <p style={{ fontSize: 13, color: "var(--muted)", fontWeight: 300 }}>No tasks added.</p>
          ) : (
            todo.tasks.map((task, idx) => (
              <div key={idx} className="task-row" onClick={() => toggleTask({ todo, idx })}>
                <div className={`task-check${task.completed ? " checked" : ""}`}>
                  {task.completed && <CheckIcon />}
                </div>
                <div>
                  <p className={`task-desc${task.completed ? " done" : ""}`}>{task.description}</p>
                  {todo.isSmartTodo && task.subtaskId && (
                    <p className="task-sync-hint">Syncs to roadmap</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="todo-footer">
          <span className="todo-date">
            {new Date(todo.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
          <div className="progress-mini">
            <div className="progress-mini-bar-bg">
              <div className="progress-mini-bar-fill" style={{ width: `${p}%` }} />
            </div>
            <span className="progress-mini-text">{done}/{total}</span>
          </div>
        </div>
      </div>
    );
  };

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
            <a key={item.href} href={item.href} className={`nav-item${item.href === "/todo" ? " active" : ""}`}>
              <span>{item.icon}</span>{item.label}
            </a>
          ))}
          <div className="sidebar-bottom">
            <button className="logout-btn" onClick={handleLogout}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Log out
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <div className="main">
          <div className="topbar">
            <h1 className="page-title">Todos</h1>
            <div className="topbar-actions">
              <button className="btn-smart" onClick={() => smartGenerate()} disabled={smartGenerating}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                {smartGenerating ? "Generating..." : "Smart Todo"}
              </button>
              <button className="btn-primary" onClick={openModal}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                New Todo
              </button>
            </div>
          </div>

          {isLoading ? (
            <div style={{ padding: "80px 40px", color: "var(--muted2)", fontSize: 14 }}>Loading...</div>
          ) : (
            <div className="todos-area">
              {/* SMART */}
              <div>
                <p className="section-label">Smart Todos</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {smartTodos.length === 0 ? (
                    <div className="empty-col">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--muted)", opacity: 0.4 }}>
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                      </svg>
                      <p className="empty-title">No smart todos</p>
                      <p className="empty-desc">Hit "Smart Todo" to auto-generate today's tasks from your active roadmaps.</p>
                    </div>
                  ) : (
                    smartTodos.map((todo, i) => renderTodoCard(todo, i))
                  )}
                </div>
              </div>

              {/* MANUAL */}
              <div>
                <p className="section-label">Manual Todos</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {manualTodos.length === 0 ? (
                    <div className="empty-col">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--muted)", opacity: 0.4 }}>
                        <path d="M9 11l3 3L22 4"/>
                        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                      </svg>
                      <p className="empty-title">No manual todos</p>
                      <p className="empty-desc">Create a todo list for anything outside your roadmap.</p>
                    </div>
                  ) : (
                    manualTodos.map((todo, i) => renderTodoCard(todo, i))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL */}
        {modalOpen && (
          <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
            <div className="modal">
              <div className="modal-header">
                <h2 className="modal-title">New Todo</h2>
                <button className="close-btn" onClick={closeModal}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  className={`form-input${titleError ? " error" : ""}`}
                  placeholder="e.g. Today's plan"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                />
                {titleError && <p className="error-msg">{titleError}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Tasks</label>
                <div className="task-inputs">
                  {form.tasks.map((task, i) => (
                    <div key={i} className="task-input-row">
                      <input
                        className="form-input"
                        placeholder={`Task ${i + 1}`}
                        value={task}
                        onChange={(e) => handleTaskChange(i, e.target.value)}
                      />
                      {form.tasks.length > 1 && (
                        <button className="remove-task-btn" onClick={() => removeTaskInput(i)}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <div className="add-task-row" onClick={addTaskInput}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Add task
                  </div>
                </div>
              </div>

              {serverError && <p className="server-error">{serverError}</p>}

              <div className="modal-footer">
                <button className="btn-ghost" onClick={closeModal}>Cancel</button>
                <button className="btn-modal-primary" onClick={handleSubmit} disabled={creating}>
                  {creating ? "Creating..." : "Create Todo"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}