import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

// ── API ──────────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

type SourceType = "twitter" | "youtube" | "reddit" | "other";

type ContentItem = {
  _id: string;
  title: string;
  link: string;
  description: string;
  sourceType: SourceType;
  createdAt: string;
};

type FormState = {
  title: string;
  link: string;
  description: string;
  sourceType: SourceType;
};

const EMPTY_FORM: FormState = { title: "", link: "", description: "", sourceType: "other" };

const fetchContent = () =>
  api.get<{ contents: ContentItem[] }>("/api/mybrain").then((r) => r.data.contents);

const createContent = (data: FormState) => api.post("/api/mybrain", data);
const updateContent = (id: string, data: FormState) => api.put(`/api/mybrain/${id}`, data);
const deleteContent = (id: string) => api.delete(`/api/mybrain/${id}`);

// ── SOURCE META ───────────────────────────────────────────────────────────
const sourceMeta: Record<SourceType, { label: string; color: string; icon: JSX.Element }> = {
  twitter: {
    label: "Twitter",
    color: "#1DA1F2",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632Zm-1.161 17.52h1.833L7.084 4.126H5.117Z"/>
      </svg>
    ),
  },
  youtube: {
    label: "YouTube",
    color: "#FF0000",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  reddit: {
    label: "Reddit",
    color: "#FF4500",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
      </svg>
    ),
  },
  other: {
    label: "Other",
    color: "#888888",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
};

// ── NAV ITEMS ─────────────────────────────────────────────────────────────
const navItems = [
  {
    label: "My Brain",
    href: "/content",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C8.5 2 6 4.5 6 7.5c0 2 1 3.7 2.5 4.7L8 16h8l-.5-3.8C17 11.2 18 9.5 18 7.5 18 4.5 15.5 2 12 2z"/>
        <line x1="9" y1="17" x2="15" y2="17"/><line x1="9.5" y1="20" x2="14.5" y2="20"/>
      </svg>
    ),
  },
  {
    label: "Roadmaps",
    href: "/roadmap",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 17l4-8 4 4 4-6 4 10"/><path d="M3 17h18"/>
      </svg>
    ),
  },
  {
    label: "Todos",
    href: "/todo",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
  },
];

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
    --error: #f87171;
    --sidebar-w: 220px;
  }

  .content-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    display: flex;
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
  .blob-1 { width: 500px; height: 500px; background: rgba(255,255,255,0.025); top: -150px; right: 0; animation: drift1 20s ease-in-out infinite; }
  .blob-2 { width: 350px; height: 350px; background: rgba(255,255,255,0.018); bottom: -80px; right: 30%; animation: drift2 24s ease-in-out infinite; }

  @keyframes drift1 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(-30px,20px); } }
  @keyframes drift2 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(20px,-20px); } }

  .grid-overlay {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
    background-size: 60px 60px;
    z-index: 0; pointer-events: none;
  }

  /* ── SIDEBAR ── */
  .sidebar {
    width: var(--sidebar-w);
    flex-shrink: 0;
    border-right: 1px solid var(--glass-border);
    display: flex;
    flex-direction: column;
    padding: 28px 16px;
    position: sticky;
    top: 0;
    height: 100vh;
    z-index: 10;
    background: rgba(8,8,8,0.7);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .brand-link {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    margin-bottom: 40px;
    padding: 0 8px;
  }

  .brand-icon {
    width: 34px; height: 34px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .brand-icon svg { width: 18px; height: 18px; }

  .brand-name {
    font-family: 'Syne', sans-serif;
    font-size: 18px;
    font-weight: 800;
    color: var(--text);
    letter-spacing: -0.5px;
  }

  .nav-label {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
    padding: 0 8px;
    margin-bottom: 8px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 10px;
    text-decoration: none;
    color: var(--muted2);
    font-size: 14px;
    font-weight: 400;
    margin-bottom: 2px;
    transition: background 0.2s, color 0.2s;
  }

  .nav-item:hover { background: var(--glass-hover); color: var(--text); }

  .nav-item.active {
    background: rgba(255,255,255,0.07);
    color: var(--text);
    font-weight: 500;
  }

  .nav-item-icon { flex-shrink: 0; }

  .sidebar-bottom {
    margin-top: auto;
  }

  .logout-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 10px 12px;
    background: transparent;
    border: 1px solid rgba(248,113,113,0.2);
    border-radius: 10px;
    color: #f87171;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s, color 0.2s;
    text-align: left;
  }

  .logout-btn:hover { border-color: rgba(248,113,113,0.45); background: rgba(248,113,113,0.07); color: #fca5a5; }

  /* ── MAIN ── */
  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 1;
    overflow-y: auto;
    min-height: 100vh;
  }

  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28px 40px 0;
    position: sticky;
    top: 0;
    z-index: 5;
  }

  .page-title {
    font-family: 'Syne', sans-serif;
    font-size: 26px;
    font-weight: 800;
    color: var(--text);
    letter-spacing: -0.5px;
  }

  .add-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: #e8e8e8;
    border: none;
    border-radius: 10px;
    color: #0a0a0a;
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
  }

  .add-btn:hover { background: #fff; transform: translateY(-1px); }
  .add-btn:active { transform: none; }

  .cards-area {
    padding: 32px 40px 48px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    align-content: start;
  }

  /* ── CARD ── */
  .card {
    background: var(--glass);
    border: 1px solid var(--glass-border);
    border-radius: 16px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    position: relative;
    transition: border-color 0.2s, background 0.2s, transform 0.2s;
    animation: fadeUp 0.4s ease forwards;
    opacity: 0;
  }

  .card:hover { border-color: rgba(255,255,255,0.13); background: var(--glass-hover); transform: translateY(-2px); }

  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }

  .card-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }

  .card-title-wrap { display: flex; flex-direction: column; gap: 6px; flex: 1; min-width: 0; }

  .source-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 8px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 500;
    width: fit-content;
    letter-spacing: 0.2px;
  }

  .card-title {
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-actions {
    display: flex;
    gap: 4px;
    flex-shrink: 0;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .card:hover .card-actions { opacity: 1; }

  .icon-btn {
    width: 30px; height: 30px;
    border-radius: 8px;
    border: 1px solid var(--glass-border);
    background: transparent;
    color: var(--muted2);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
  }

  .icon-btn:hover { background: rgba(255,255,255,0.07); color: var(--text); border-color: rgba(255,255,255,0.14); }
  .icon-btn.delete:hover { background: rgba(248,113,113,0.1); color: #f87171; border-color: rgba(248,113,113,0.3); }

  .card-desc {
    font-size: 13px;
    color: var(--muted2);
    line-height: 1.6;
    font-weight: 300;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-link {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--muted);
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: color 0.15s;
    margin-top: auto;
  }

  .card-link:hover { color: var(--text); }

  .card-date { font-size: 11px; color: var(--muted); }

  /* ── EMPTY STATE ── */
  .empty {
    grid-column: 1 / -1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 40px;
    gap: 16px;
    color: var(--muted2);
  }

  .empty-icon { color: var(--muted); opacity: 0.5; }
  .empty-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; color: var(--text); }
  .empty-desc { font-size: 14px; color: var(--muted2); font-weight: 300; }

  /* ── MODAL ── */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.75);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .modal {
    width: 100%;
    max-width: 480px;
    background: #111111;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 20px;
    padding: 36px;
    box-shadow: 0 32px 64px rgba(0,0,0,0.6);
    animation: slideUp 0.25s ease;
  }

  @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

  .modal-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 28px;
  }

  .modal-title {
    font-family: 'Syne', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: var(--text);
    letter-spacing: -0.3px;
  }

  .close-btn {
    width: 32px; height: 32px;
    border-radius: 8px;
    border: 1px solid var(--glass-border);
    background: transparent;
    color: var(--muted2);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }

  .close-btn:hover { background: rgba(255,255,255,0.06); color: var(--text); }

  .form-group { margin-bottom: 18px; }

  .form-label {
    display: block;
    font-size: 11px;
    font-weight: 500;
    color: var(--muted2);
    letter-spacing: 0.8px;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .form-input, .form-textarea, .form-select {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    padding: 11px 14px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: var(--text);
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }

  .form-input::placeholder, .form-textarea::placeholder { color: var(--muted); }
  .form-textarea { resize: vertical; min-height: 90px; }
  .form-select option { background: #111; color: var(--text); }

  .form-input:focus, .form-textarea:focus, .form-select:focus {
    border-color: rgba(255,255,255,0.25);
    background: rgba(255,255,255,0.06);
    box-shadow: 0 0 0 3px rgba(255,255,255,0.05);
  }

  .form-input.error, .form-textarea.error, .form-select.error {
    border-color: var(--error);
  }

  .error-msg { font-size: 12px; color: var(--error); margin-top: 5px; }

  .modal-footer {
    display: flex;
    gap: 10px;
    margin-top: 24px;
  }

  .btn-primary {
    flex: 1;
    padding: 12px;
    background: #e8e8e8;
    border: none;
    border-radius: 10px;
    color: #0a0a0a;
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }

  .btn-primary:hover { background: #fff; }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

  .btn-ghost {
    padding: 12px 20px;
    background: transparent;
    border: 1px solid var(--glass-border);
    border-radius: 10px;
    color: var(--muted2);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }

  .btn-ghost:hover { background: rgba(255,255,255,0.05); color: var(--text); }

  .server-error { font-size: 13px; color: var(--error); text-align: center; margin-top: 10px; }
`;

// ── COMPONENT ─────────────────────────────────────────────────────────────
export default function Content() {
  const qc = useQueryClient();
  const [modal, setModal] = useState<{ open: boolean; editing: ContentItem | null }>({ open: false, editing: null });
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<Partial<FormState>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const { data: contents = [], isLoading } = useQuery({
    queryKey: ["contents"],
    queryFn: fetchContent,
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["contents"] });

  const { mutate: save, isPending: saving } = useMutation({
    mutationFn: () =>
      modal.editing ? updateContent(modal.editing._id, form) : createContent(form),
    onSuccess: () => { invalidate(); closeModal(); },
    onError: (err: AxiosError<{ message: string }>) => {
      setServerError(err.response?.data?.message ?? "Something went wrong.");
    },
  });

  const { mutate: remove } = useMutation({
    mutationFn: (id: string) => deleteContent(id),
    onSuccess: invalidate,
  });

  const openAdd = () => { setForm(EMPTY_FORM); setFormErrors({}); setServerError(null); setModal({ open: true, editing: null }); };
  const openEdit = (item: ContentItem) => { setForm({ title: item.title, link: item.link, description: item.description, sourceType: item.sourceType }); setFormErrors({}); setServerError(null); setModal({ open: true, editing: item }); };
  const closeModal = () => setModal({ open: false, editing: null });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (formErrors[name as keyof FormState]) setFormErrors((p) => ({ ...p, [name]: undefined }));
    if (serverError) setServerError(null);
  };

  const validate = () => {
    const errs: Partial<FormState> = {};
    if (!form.title.trim()) errs.title = "Title is required.";
    if (!form.link.trim()) errs.link = "Link is required.";
    if (!form.description.trim()) errs.description = "Description is required.";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => { if (validate()) save(); };

  const handleLogout = () => { localStorage.removeItem("token"); window.location.href = "/signin"; };

  const currentPath = "/content";

  return (
    <>
      <style>{styles}</style>
      <div className="content-root">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="grid-overlay" />

        {/* ── SIDEBAR ── */}
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
            <a
              key={item.href}
              href={item.href}
              className={`nav-item${currentPath === item.href ? " active" : ""}`}
            >
              <span className="nav-item-icon">{item.icon}</span>
              {item.label}
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

        {/* ── MAIN ── */}
        <div className="main">
          <div className="topbar">
            <h1 className="page-title">My Brain</h1>
            <button className="add-btn" onClick={openAdd}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Content
            </button>
          </div>

          <div className="cards-area">
            {isLoading ? (
              <div className="empty">
                <p className="empty-desc">Loading...</p>
              </div>
            ) : contents.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2C8.5 2 6 4.5 6 7.5c0 2 1 3.7 2.5 4.7L8 16h8l-.5-3.8C17 11.2 18 9.5 18 7.5 18 4.5 15.5 2 12 2z"/>
                    <line x1="9" y1="17" x2="15" y2="17"/><line x1="9.5" y1="20" x2="14.5" y2="20"/>
                  </svg>
                </div>
                <p className="empty-title">Nothing saved yet</p>
                <p className="empty-desc">Add your first link, article, or resource.</p>
              </div>
            ) : (
              contents.map((item, i) => {
                const meta = sourceMeta[item.sourceType as SourceType] ?? sourceMeta["other"];
                return (
                  <div className="card" key={item._id} style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="card-header">
                      <div className="card-title-wrap">
                        <span
                          className="source-badge"
                          style={{ background: `${meta.color}18`, color: meta.color }}
                        >
                          {meta.icon}
                          {meta.label}
                        </span>
                        <span className="card-title">{item.title}</span>
                      </div>
                      <div className="card-actions">
                        <button className="icon-btn" onClick={() => openEdit(item)} title="Edit">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button className="icon-btn delete" onClick={() => remove(item._id)} title="Delete">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                            <path d="M10 11v6"/><path d="M14 11v6"/>
                            <path d="M9 6V4h6v2"/>
                          </svg>
                        </button>
                      </div>
                    </div>

                    <p className="card-desc">{item.description}</p>

                    <a className="card-link" href={item.link} target="_blank" rel="noreferrer">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                        <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                      </svg>
                      {item.link}
                    </a>

                    <span className="card-date">{new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── MODAL ── */}
        {modal.open && (
          <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
            <div className="modal">
              <div className="modal-header">
                <h2 className="modal-title">{modal.editing ? "Edit Content" : "Add Content"}</h2>
                <button className="close-btn" onClick={closeModal}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              <div className="form-group">
                <label className="form-label">Title</label>
                <input className={`form-input${formErrors.title ? " error" : ""}`} name="title" placeholder="What is this about?" value={form.title} onChange={handleChange} />
                {formErrors.title && <p className="error-msg">{formErrors.title}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Link</label>
                <input className={`form-input${formErrors.link ? " error" : ""}`} name="link" placeholder="https://..." value={form.link} onChange={handleChange} />
                {formErrors.link && <p className="error-msg">{formErrors.link}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className={`form-textarea${formErrors.description ? " error" : ""}`} name="description" placeholder="Brief summary or notes..." value={form.description} onChange={handleChange} />
                {formErrors.description && <p className="error-msg">{formErrors.description}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Source Type</label>
                <select className="form-select" name="sourceType" value={form.sourceType} onChange={handleChange}>
                  <option value="twitter">Twitter</option>
                  <option value="youtube">YouTube</option>
                  <option value="reddit">Reddit</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {serverError && <p className="server-error">{serverError}</p>}

              <div className="modal-footer">
                <button className="btn-ghost" onClick={closeModal}>Cancel</button>
                <button className="btn-primary" onClick={handleSubmit} disabled={saving}>
                  {saving ? "Saving..." : modal.editing ? "Save Changes" : "Add Content"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}