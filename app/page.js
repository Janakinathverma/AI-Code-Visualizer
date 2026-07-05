"use client";
import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { UserButton, SignInButton, useUser } from "@clerk/nextjs";
import Link from "next/link";

// CodeMirror — no workers, no SSR issues, Turbopack-safe
const CodeMirrorEditor = dynamic(() => import("./CodeMirrorEditor"), { ssr: false });

const languages = [
  { name: "JavaScript", value: "javascript", icon: "JS" },
  { name: "TypeScript", value: "typescript", icon: "TS" },
  { name: "Python",     value: "python",     icon: "PY" },
  { name: "Java",       value: "java",       icon: "JV" },
  { name: "C++",        value: "cpp",        icon: "C+" },
  { name: "C#",         value: "csharp",     icon: "C#" },
  { name: "Go",         value: "go",         icon: "GO" },
  { name: "Ruby",       value: "ruby",       icon: "RB" },
  { name: "Swift",      value: "swift",      icon: "SW" },
  { name: "PHP",        value: "php",        icon: "PHP" },
];

const getDefaultCode = (lang) => {
  const selected = languages.find((l) => l.value === lang);
  return `// Write or paste your ${selected?.name || lang} code here...\n\nfunction example() {\n  // Your logic goes here\n}`;
};

export default function Home() {
  const { isSignedIn } = useUser();
  const [language, setLanguage]   = useState("javascript");
  const [code, setCode]           = useState(getDefaultCode("javascript"));
  const [output, setOutput]       = useState("");
  const [loading, setLoading]     = useState(false);
  const [copied, setCopied]       = useState(false);
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);
  const [title, setTitle]           = useState("My Logic Diagram");

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    setCode(getDefaultCode(newLang));
    setOutput("");
  };

  const generateDiagram = async () => {
    if (!code.trim() || code.trim().startsWith("//")) {
      alert("Please enter some actual code first!");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post("/api/generate", { code, language });
      setOutput(response.data.mermaidSyntax);
    } catch (error) {
      console.error("Error generating diagram:", error);
      alert("Failed to generate diagram. Check your API key or connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveProject = async () => {
    if (!output) return;
    if (!isSignedIn) return alert("Please sign in to save projects!");
    setSaving(true);
    try {
      await axios.post("/api/save", { title, code, mermaidSyntax: output, language });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Save error:", error);
      alert(error.response?.data?.error || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const selectedLang = languages.find((l) => l.value === language);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Syne:wght@400;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #0a0a0f;
          --surface: #111118;
          --surface2: #18181f;
          --border: rgba(255,255,255,0.07);
          --border-accent: rgba(99,102,241,0.4);
          --text: #f0f0f8;
          --text-muted: #6b6b80;
          --text-dim: #3a3a50;
          --accent: #6366f1;
          --accent-glow: rgba(99,102,241,0.25);
          --accent2: #a78bfa;
          --success: #34d399;
          --font-mono: 'JetBrains Mono', monospace;
          --font-display: 'Syne', sans-serif;
        }
        body { background: var(--bg); color: var(--text); font-family: var(--font-display); overflow: hidden; }
        .app { display: flex; flex-direction: column; height: 100vh; }
        .header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 24px; height: 60px;
          background: var(--surface); border-bottom: 1px solid var(--border);
          flex-shrink: 0; position: relative; z-index: 20;
        }
        .header::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent), transparent); opacity: 0.6;
        }
        .logo { display: flex; align-items: center; gap: 10px; }

        .logo-text {
          font-size: 16px; font-weight: 800; letter-spacing: -0.03em;
          background: linear-gradient(135deg, #fff 30%, var(--accent2));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .logo-text span { -webkit-text-fill-color: var(--accent2); }
        .header-right { display: flex; align-items: center; gap: 12px; }
        .lang-select-wrapper {
          display: flex; align-items: center; gap: 8px;
          background: var(--surface2); border: 1px solid var(--border);
          border-radius: 8px; padding: 6px 12px; transition: border-color 0.2s;
        }
        .lang-select-wrapper:hover { border-color: var(--border-accent); }
        .lang-badge {
          font-family: var(--font-mono); font-size: 10px; font-weight: 600;
          color: var(--accent2); background: rgba(167,139,250,0.1);
          padding: 2px 6px; border-radius: 4px; letter-spacing: 0.05em;
        }
        .lang-select {
          background: transparent; border: none; outline: none;
          color: var(--text); font-family: var(--font-display);
          font-size: 13px; font-weight: 500; cursor: pointer; appearance: none;
        }
        .lang-select option { background: #1a1a2e; }
        .btn-generate {
          display: flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          border: none; border-radius: 8px; padding: 8px 18px;
          color: white; font-family: var(--font-display); font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.2s; box-shadow: 0 0 20px var(--accent-glow);
        }
        .btn-generate:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 24px var(--accent-glow); }
        .btn-generate:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .spinner {
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: white;
          border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .divider { width: 1px; height: 24px; background: var(--border); }
        .auth-btn {
          font-family: var(--font-display); font-size: 13px; font-weight: 500;
          color: var(--text-muted); background: none;
          border: 1px solid var(--border); border-radius: 8px; padding: 6px 14px;
          cursor: pointer; transition: all 0.2s;
        }
        .auth-btn:hover { color: var(--text); border-color: var(--border-accent); background: var(--accent-glow); }
        .main { display: flex; flex: 1; overflow: hidden; }
        .panel { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
        .panel-left { border-right: 1px solid var(--border); }
        .panel-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 16px; height: 40px;
          background: var(--surface); border-bottom: 1px solid var(--border); flex-shrink: 0;
        }
        .panel-label {
          display: flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 600; color: var(--text-muted);
          letter-spacing: 0.1em; text-transform: uppercase; font-family: var(--font-mono);
        }
        .panel-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--accent); box-shadow: 0 0 6px var(--accent);
        }
        .panel-dot.green { background: var(--success); box-shadow: 0 0 6px var(--success); }
        .btn-clear {
          font-family: var(--font-mono); font-size: 11px; color: var(--text-dim);
          background: none; border: none; cursor: pointer; padding: 4px 8px;
          border-radius: 4px; transition: color 0.2s;
        }
        .btn-clear:hover { color: var(--text-muted); }
        .editor-wrap { flex: 1; overflow: hidden; background: #0d0d14; }
        .editor-loading {
          display: flex; align-items: center; justify-content: center;
          height: 100%; background: #0d0d14; color: #6b6b80;
          font-family: monospace; font-size: 13px; gap: 10px;
        }
        .output-body {
          flex: 1; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 24px; overflow: auto; background: var(--surface);
        }
        .empty-state { display: flex; flex-direction: column; align-items: center; gap: 16px; text-align: center; animation: fadeIn 0.4s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .empty-icon {
          width: 72px; height: 72px; border-radius: 20px;
          background: var(--surface2); border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center; font-size: 28px;
        }
        .empty-title { font-size: 16px; font-weight: 700; letter-spacing: -0.02em; }
        .empty-sub { font-size: 13px; color: var(--text-muted); font-family: var(--font-mono); max-width: 240px; line-height: 1.6; }
        .steps { display: flex; flex-direction: column; gap: 8px; margin-top: 8px; }
        .step { display: flex; align-items: center; gap: 10px; font-size: 12px; color: var(--text-muted); font-family: var(--font-mono); }
        .step-num {
          width: 20px; height: 20px; border-radius: 50%;
          background: var(--surface2); border: 1px solid var(--border-accent);
          display: flex; align-items: center; justify-content: center;
          font-size: 10px; color: var(--accent2); flex-shrink: 0;
        }
        .output-result { width: 100%; height: 100%; display: flex; flex-direction: column; gap: 16px; animation: fadeIn 0.4s ease; }
        .output-toolbar { display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
        .output-badge {
          display: flex; align-items: center; gap: 6px;
          font-size: 11px; font-family: var(--font-mono); color: var(--success); font-weight: 600;
        }
        .output-badge::before {
          content: ''; width: 6px; height: 6px; border-radius: 50%;
          background: var(--success); box-shadow: 0 0 6px var(--success);
        }
        .btn-copy {
          display: flex; align-items: center; gap: 6px;
          font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);
          background: var(--surface2); border: 1px solid var(--border);
          border-radius: 6px; padding: 5px 12px; cursor: pointer; transition: all 0.2s;
        }
        .btn-copy:hover { color: var(--text); border-color: var(--border-accent); }
        .btn-copy.copied { color: var(--success); border-color: var(--success); }
        .code-block {
          flex: 1; background: #0d0d14; border: 1px solid var(--border); border-radius: 12px;
          padding: 20px; overflow: auto; font-family: var(--font-mono);
          font-size: 13px; line-height: 1.8; color: #a78bfa; white-space: pre; min-height: 0;
        }
        .hint-box {
          display: flex; gap: 10px; align-items: flex-start;
          background: rgba(99,102,241,0.06); border: 1px solid rgba(99,102,241,0.15);
          border-radius: 10px; padding: 14px 16px; flex-shrink: 0;
        }
        .hint-icon { font-size: 16px; flex-shrink: 0; }
        .hint-text { font-size: 12px; font-family: var(--font-mono); color: var(--text-muted); line-height: 1.6; }
        .hint-text strong { color: var(--accent2); font-weight: 600; }
        .dashboard-link {
          font-family: var(--font-mono); font-size: 11px; font-weight: 500;
          color: var(--text-muted); text-decoration: none;
          background: var(--surface2); border: 1px solid var(--border);
          border-radius: 8px; padding: 6px 14px;
          transition: all 0.2s; letter-spacing: 0.03em;
        }
        .dashboard-link:hover { color: var(--text); border-color: var(--border-accent); }
        .save-bar {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 16px; flex-shrink: 0;
          background: var(--surface2); border-bottom: 1px solid var(--border);
          animation: fadeIn 0.3s ease;
        }
        .save-input {
          flex: 1; background: transparent;
          border: none; border-bottom: 1px solid var(--border);
          color: var(--text); font-family: var(--font-mono); font-size: 12px;
          outline: none; padding: 4px 0;
          transition: border-color 0.2s;
        }
        .save-input:focus { border-color: var(--accent2); }
        .save-input::placeholder { color: var(--text-dim); }
        .btn-save {
          display: flex; align-items: center; gap: 6px;
          font-family: var(--font-mono); font-size: 11px; font-weight: 600;
          background: linear-gradient(135deg, #059669, #10b981);
          color: white; border: none; border-radius: 6px;
          padding: 6px 14px; cursor: pointer; transition: all 0.2s;
          white-space: nowrap; box-shadow: 0 0 12px rgba(16,185,129,0.25);
        }
        .btn-save:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(16,185,129,0.35); }
        .btn-save:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .btn-save.saved { background: linear-gradient(135deg, #065f46, #059669); }
        .toast {
          position: fixed; bottom: 24px; right: 24px; z-index: 100;
          display: flex; align-items: center; gap: 10px;
          background: #0d0d14; border: 1px solid #10b981;
          border-radius: 10px; padding: 14px 18px;
          font-family: var(--font-mono); font-size: 12px; color: #10b981;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          animation: slideUp 0.3s ease;
        }
        @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
      `}</style>

      <div className="app">
        <header className="header">
          <div className="logo">
            <span className="logo-text">AI Code <span>Visualizer</span></span>
          </div>
          <div className="header-right">
            <div className="lang-select-wrapper">
              <span className="lang-badge">{selectedLang?.icon || "JS"}</span>
              <select className="lang-select" value={language} onChange={(e) => handleLanguageChange(e.target.value)}>
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>{lang.name}</option>
                ))}
              </select>
            </div>
            <button className="btn-generate" onClick={generateDiagram} disabled={loading}>
              {loading ? <span className="spinner" /> : "⚡"}
              {loading ? "Generating..." : "Generate Flowchart"}
            </button>
            {isSignedIn && (
              <Link href="/dashboard" className="dashboard-link">My Projects</Link>
            )}
            <div className="divider" />
            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal">
                <button className="auth-btn">Sign In</button>
              </SignInButton>
            )}
          </div>
        </header>

        <main className="main">
          <div className="panel panel-left">
            <div className="panel-header">
              <span className="panel-label">
                <span className="panel-dot" />
                editor · {selectedLang?.name}
              </span>
              <button className="btn-clear" onClick={() => setCode("")}>clear</button>
            </div>
            <div className="editor-wrap">
              <CodeMirrorEditor
                value={code}
                language={language}
                onChange={setCode}
              />
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <span className="panel-label">
                <span className={`panel-dot ${output ? "green" : ""}`} />
                flowchart preview
              </span>
              {output && (
                <button className={`btn-copy ${copied ? "copied" : ""}`} onClick={handleCopy}>
                  {copied ? "✓ copied" : "copy"}
                </button>
              )}
            </div>
            <div className="output-body">
              {saved && (
                <div className="toast">✓ Project saved successfully!</div>
              )}
              {output ? (
                <div className="output-result">
                  {output && (
                    <div className="save-bar">
                      <input
                        type="text"
                        className="save-input"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Project title..."
                      />
                      <button
                        className={`btn-save ${saved ? "saved" : ""}`}
                        onClick={saveProject}
                        disabled={saving}
                      >
                        {saving ? <><span className="spinner" style={{width:"10px",height:"10px",borderWidth:"1.5px"}} /> Saving...</> : saved ? "✓ Saved!" : "💾 Save to Cloud"}
                      </button>
                    </div>
                  )}
                  <div className="output-toolbar">
                    <span className="output-badge">Mermaid syntax generated</span>
                  </div>
                  <div className="code-block">{output}</div>
                  <div className="hint-box">
                    <span className="hint-icon">💡</span>
                    <p className="hint-text">
                      <strong>Next step:</strong> Paste this into <strong>mermaid.live</strong> or
                      add the Mermaid renderer to see the actual diagram.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📊</div>
                  <p className="empty-title">Flowchart appears here</p>
                  <p className="empty-sub">Paste your code on the left and click generate</p>
                  <div className="steps">
                    {["Paste your code", "Select language", "Click generate"].map((s, i) => (
                      <div className="step" key={i}>
                        <span className="step-num">{i + 1}</span>
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
