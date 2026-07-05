"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    axios.get("/api/projects")
      .then((res) => setProjects(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this project?")) return;
    setDeleting(id);
    try {
      await axios.delete("/api/projects", { data: { id } });
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch {
      alert("Failed to delete.");
    } finally {
      setDeleting(null);
    }
  };

  const langColors = {
    javascript: "#f7df1e", typescript: "#3178c6", python: "#3776ab",
    java: "#f89820", cpp: "#00599c", csharp: "#239120",
    go: "#00acd7", ruby: "#cc342d", swift: "#fa7343", php: "#777bb4",
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Syne:wght@400;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #0a0a0f; --surface: #111118; --surface2: #18181f;
          --border: rgba(255,255,255,0.07); --border-accent: rgba(99,102,241,0.4);
          --text: #f0f0f8; --text-muted: #6b6b80; --text-dim: #3a3a50;
          --accent: #6366f1; --accent-glow: rgba(99,102,241,0.25); --accent2: #a78bfa;
          --success: #34d399; --font-mono: 'JetBrains Mono', monospace; --font-display: 'Syne', sans-serif;
        }
        body { background: var(--bg); color: var(--text); font-family: var(--font-display); }
        .dash { min-height: 100vh; padding: 0; }
        .dash-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 32px; height: 60px;
          background: var(--surface); border-bottom: 1px solid var(--border);
          position: sticky; top: 0; z-index: 10;
        }
        .dash-header::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent); opacity: 0.6;
        }
        .logo-text {
          font-size: 16px; font-weight: 800; letter-spacing: -0.03em;
          background: linear-gradient(135deg, #fff 30%, var(--accent2));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .logo-text span { -webkit-text-fill-color: var(--accent2); }
        .btn-new {
          display: flex; align-items: center; gap: 6px;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          border: none; border-radius: 8px; padding: 8px 16px;
          color: white; font-family: var(--font-display); font-size: 13px; font-weight: 600;
          cursor: pointer; text-decoration: none; transition: all 0.2s;
          box-shadow: 0 0 16px var(--accent-glow);
        }
        .btn-new:hover { transform: translateY(-1px); box-shadow: 0 4px 20px var(--accent-glow); }
        .dash-body { padding: 40px 32px; max-width: 1200px; margin: 0 auto; }
        .dash-title { font-size: 28px; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 4px; }
        .dash-sub { font-size: 13px; color: var(--text-muted); font-family: var(--font-mono); margin-bottom: 32px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 14px; padding: 20px; display: flex; flex-direction: column; gap: 14px;
          transition: all 0.2s; position: relative; overflow: hidden;
        }
        .card:hover { border-color: var(--border-accent); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.3); }
        .card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--accent), var(--accent2));
          opacity: 0; transition: opacity 0.2s;
        }
        .card:hover::before { opacity: 1; }
        .card-top { display: flex; align-items: center; justify-content: space-between; }
        .lang-tag {
          font-family: var(--font-mono); font-size: 10px; font-weight: 700;
          padding: 3px 8px; border-radius: 5px; letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .card-date { font-size: 10px; color: var(--text-dim); font-family: var(--font-mono); }
        .card-title { font-size: 15px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.3; }
        .card-preview {
          font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);
          background: var(--surface2); border: 1px solid var(--border);
          border-radius: 8px; padding: 10px; line-height: 1.6;
          max-height: 60px; overflow: hidden; position: relative;
        }
        .card-preview::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 24px;
          background: linear-gradient(transparent, var(--surface2));
        }
        .card-actions { display: flex; gap: 8px; margin-top: auto; }
        .btn-action {
          flex: 1; font-family: var(--font-mono); font-size: 11px; font-weight: 500;
          background: var(--surface2); border: 1px solid var(--border);
          color: var(--text-muted); border-radius: 7px; padding: 7px;
          cursor: pointer; transition: all 0.2s; text-align: center;
        }
        .btn-action:hover { color: var(--text); border-color: var(--border-accent); }
        .btn-action.danger:hover { color: #f87171; border-color: rgba(248,113,113,0.4); background: rgba(248,113,113,0.05); }
        .btn-action:disabled { opacity: 0.4; cursor: not-allowed; }
        .skeleton { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; height: 180px; animation: pulse 1.5s ease infinite; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        .empty {
          grid-column: 1/-1; text-align: center; padding: 80px 20px;
          border: 1px dashed var(--border); border-radius: 16px; color: var(--text-muted);
        }
        .empty-icon { font-size: 40px; margin-bottom: 16px; }
        .empty-text { font-size: 15px; font-weight: 600; margin-bottom: 8px; }
        .empty-sub { font-size: 12px; font-family: var(--font-mono); }
      `}</style>

      <div className="dash">
        <header className="dash-header">
          <span className="logo-text">AI Code <span>Visualizer</span></span>
          <Link href="/" className="btn-new">+ New Diagram</Link>
        </header>

        <div className="dash-body">
          <h1 className="dash-title">My Projects</h1>
          <p className="dash-sub">All your saved flowcharts in one place</p>

          <div className="grid">
            {loading ? (
              [1,2,3].map((n) => <div key={n} className="skeleton" />)
            ) : projects.length === 0 ? (
              <div className="empty">
                <div className="empty-icon">📂</div>
                <p className="empty-text">No saved projects yet</p>
                <p className="empty-sub">Generate a flowchart and save it to see it here</p>
              </div>
            ) : (
              projects.map((project) => {
                const color = langColors[project.language] || "#6366f1";
                return (
                  <div key={project._id} className="card">
                    <div className="card-top">
                      <span className="lang-tag" style={{ color, background: `${color}18`, border: `1px solid ${color}30` }}>
                        {project.language}
                      </span>
                      <span className="card-date">{new Date(project.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}</span>
                    </div>
                    <p className="card-title">{project.title}</p>
                    <div className="card-preview">{project.mermaidSyntax}</div>
                    <div className="card-actions">
                      <button
                        className="btn-action danger"
                        onClick={() => handleDelete(project._id)}
                        disabled={deleting === project._id}
                      >
                        {deleting === project._id ? "Deleting..." : "🗑 Delete"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}
