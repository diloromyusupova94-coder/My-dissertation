import { useState, useEffect } from "react";

// ─── Load JSON data ────────────────────────────────────────────────────────────
const DATA_URL = "./dissertation.json";

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconMenu = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const IconClose = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconChevron = ({ open }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.25s" }}>
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const IconBook = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

// ─── Styles ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,300;1,400&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #faf8f4;
    --bg2:       #f3efe8;
    --bg3:       #ebe5d9;
    --ink:       #1c1710;
    --ink2:      #3d3629;
    --ink3:      #6b6050;
    --gold:      #b8860b;
    --gold-lt:   #d4a017;
    --gold-bg:   #fdf5e0;
    --accent:    #5c3d1e;
    --border:    #ddd4c0;
    --shadow:    0 2px 16px rgba(92,61,30,0.10);
    --shadow-lg: 0 8px 40px rgba(92,61,30,0.16);
    --radius:    10px;
    --sidebar-w: 300px;
    --font-serif: 'Source Serif 4', Georgia, serif;
    --font-display: 'Playfair Display', Georgia, serif;
    --font-mono: 'JetBrains Mono', monospace;
  }

  html { scroll-behavior: smooth; }
  body { background: var(--bg); color: var(--ink); font-family: var(--font-serif); min-height: 100vh; }

  /* ── LAYOUT ── */
  .app { display: flex; min-height: 100vh; }

  /* ── SIDEBAR ── */
  .sidebar {
    width: var(--sidebar-w); min-height: 100vh; background: var(--accent);
    color: #f5edd8; display: flex; flex-direction: column;
    position: fixed; top: 0; left: 0; z-index: 100;
    transition: transform 0.32s cubic-bezier(.4,0,.2,1);
    box-shadow: 4px 0 24px rgba(0,0,0,.18);
  }
  .sidebar.closed { transform: translateX(calc(-1 * var(--sidebar-w))); }

  .sidebar-header {
    padding: 28px 22px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.12);
  }
  .sidebar-logo {
    display: flex; align-items: center; gap: 10px; margin-bottom: 14px;
  }
  .sidebar-logo svg { opacity: 0.85; }
  .sidebar-logo span {
    font-family: var(--font-display); font-size: 15px; font-weight: 600;
    letter-spacing: 0.02em; line-height: 1.3; opacity: 0.92;
  }
  .sidebar-title {
    font-family: var(--font-display); font-size: 13px; font-style: italic;
    line-height: 1.5; opacity: 0.7; font-weight: 400;
  }

  .sidebar-nav { flex: 1; overflow-y: auto; padding: 12px 0 24px; }
  .sidebar-nav::-webkit-scrollbar { width: 4px; }
  .sidebar-nav::-webkit-scrollbar-track { background: transparent; }
  .sidebar-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,.2); border-radius: 2px; }

  .nav-section { margin-bottom: 4px; }
  .nav-section-btn {
    width: 100%; display: flex; align-items: center; justify-content: space-between;
    padding: 10px 22px; background: none; border: none; cursor: pointer;
    color: #f5edd8; font-family: var(--font-serif); font-size: 13.5px;
    text-align: left; letter-spacing: 0.01em; transition: background 0.18s;
    gap: 8px;
  }
  .nav-section-btn:hover { background: rgba(255,255,255,0.08); }
  .nav-section-btn.active { background: rgba(255,220,100,0.14); color: #fde68a; }
  .nav-section-label { flex: 1; font-weight: 600; }

  .nav-sub { overflow: hidden; transition: max-height 0.3s ease; }
  .nav-sub-item {
    display: block; width: 100%; padding: 8px 22px 8px 36px;
    background: none; border: none; cursor: pointer;
    color: rgba(245,237,216,0.72); font-family: var(--font-serif);
    font-size: 12.5px; text-align: left; transition: all 0.18s;
    border-left: 2px solid transparent; line-height: 1.45;
  }
  .nav-sub-item:hover { color: #fde68a; background: rgba(255,255,255,0.05); }
  .nav-sub-item.active {
    color: #fde68a; border-left-color: var(--gold-lt);
    background: rgba(255,220,100,0.08);
  }

  /* ── TOGGLE BTN ── */
  .sidebar-toggle {
    position: fixed; top: 18px; left: 18px; z-index: 200;
    width: 42px; height: 42px; border-radius: 50%;
    background: var(--accent); color: #f5edd8;
    border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
    box-shadow: var(--shadow); transition: left 0.32s cubic-bezier(.4,0,.2,1), background 0.18s;
  }
  .sidebar-toggle.open { left: calc(var(--sidebar-w) + 14px); background: var(--ink); }
  .sidebar-toggle:hover { opacity: 0.88; }

  /* ── MAIN ── */
  .main {
    flex: 1; margin-left: var(--sidebar-w);
    transition: margin-left 0.32s cubic-bezier(.4,0,.2,1);
    min-height: 100vh;
  }
  .main.full { margin-left: 0; }

  /* ── COVER ── */
  .cover {
    background: linear-gradient(160deg, #3d2a12 0%, var(--accent) 45%, #7a4f22 100%);
    color: #f5edd8; padding: 80px 60px 72px; position: relative; overflow: hidden;
  }
  .cover::before {
    content: ''; position: absolute; inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
  .cover-ornament {
    position: absolute; top: 0; right: 0; width: 340px; height: 340px; opacity: 0.06;
    background: radial-gradient(circle, #f5d680 0%, transparent 70%);
  }
  .cover-content { position: relative; z-index: 1; max-width: 680px; }
  .cover-institution {
    font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.12em;
    text-transform: uppercase; opacity: 0.65; margin-bottom: 8px;
  }
  .cover-dept {
    font-family: var(--font-serif); font-size: 13px; opacity: 0.7;
    margin-bottom: 32px; font-style: italic;
  }
  .cover-divider {
    width: 60px; height: 2px; background: var(--gold-lt); margin-bottom: 32px; opacity: 0.8;
  }
  .cover-title {
    font-family: var(--font-display); font-size: clamp(22px, 3vw, 34px);
    font-weight: 700; line-height: 1.28; margin-bottom: 28px; letter-spacing: -0.01em;
  }
  .cover-author {
    font-family: var(--font-display); font-size: 17px; font-style: italic;
    opacity: 0.88; margin-bottom: 6px;
  }
  .cover-specialty {
    font-family: var(--font-mono); font-size: 11.5px; opacity: 0.5;
    letter-spacing: 0.04em;
  }
  .cover-meta {
    display: flex; gap: 32px; margin-top: 40px; padding-top: 28px;
    border-top: 1px solid rgba(255,255,255,0.15);
  }
  .cover-meta-item { font-size: 12.5px; opacity: 0.65; }
  .cover-meta-item strong { display: block; font-size: 11px; opacity: 0.55;
    font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 3px; }

  /* ── CONTENT ── */
  .content { padding: 52px 60px; max-width: 820px; }

  .section { margin-bottom: 56px; animation: fadeIn 0.4s ease; }
  @keyframes fadeIn { from { opacity:0; transform: translateY(12px); } to { opacity:1; transform: none; } }

  .section-heading {
    display: flex; align-items: center; gap: 14px; margin-bottom: 28px;
  }
  .section-number {
    font-family: var(--font-mono); font-size: 11px; font-weight: 500;
    color: var(--gold); letter-spacing: 0.08em; text-transform: uppercase;
    white-space: nowrap;
  }
  .section-title {
    font-family: var(--font-display); font-size: clamp(17px, 2.2vw, 23px);
    font-weight: 600; color: var(--accent); line-height: 1.3;
  }
  .section-divider { flex: 1; height: 1px; background: var(--border); }

  .subsection { margin-bottom: 36px; }
  .subsection-title {
    font-family: var(--font-display); font-size: 16px; font-weight: 600;
    color: var(--ink2); margin-bottom: 14px; padding-bottom: 8px;
    border-bottom: 1px solid var(--bg3);
  }
  .subsection-pages {
    font-family: var(--font-mono); font-size: 11px; color: var(--ink3);
    margin-left: 10px; opacity: 0.7;
  }

  .prose {
    font-size: 15px; line-height: 1.82; color: var(--ink2); font-weight: 300;
  }
  .prose p { margin-bottom: 1.1em; }

  /* tasks/novelty lists */
  .feature-list { list-style: none; margin-top: 16px; }
  .feature-list li {
    display: flex; gap: 12px; align-items: flex-start;
    padding: 10px 14px; margin-bottom: 6px;
    background: var(--bg2); border-radius: var(--radius);
    font-size: 14.5px; line-height: 1.6; color: var(--ink2); border-left: 3px solid var(--gold);
    transition: background 0.15s;
  }
  .feature-list li:hover { background: var(--gold-bg); }
  .feature-list li::before { content: '—'; color: var(--gold); font-weight: 600; flex-shrink: 0; margin-top: 1px; }

  /* conclusion box */
  .conclusion-box {
    background: var(--gold-bg); border: 1px solid #e8d48a;
    border-left: 4px solid var(--gold); border-radius: var(--radius);
    padding: 18px 22px; margin-top: 24px;
    font-size: 14.5px; line-height: 1.72; color: var(--ink2); font-style: italic;
  }
  .conclusion-box strong { font-style: normal; font-family: var(--font-mono);
    font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.08em;
    color: var(--gold); display: block; margin-bottom: 6px; font-weight: 500; }

  /* xulosa points */
  .conclusion-point {
    background: var(--bg2); border-radius: var(--radius);
    padding: 18px 22px; margin-bottom: 12px;
    border-left: 3px solid var(--gold);
    transition: box-shadow 0.18s;
  }
  .conclusion-point:hover { box-shadow: var(--shadow); }
  .conclusion-point-num {
    font-family: var(--font-display); font-size: 14px; font-weight: 700;
    color: var(--accent); margin-bottom: 6px;
  }
  .conclusion-point-text { font-size: 14.5px; line-height: 1.74; color: var(--ink2); font-weight: 300; }

  /* bibliography */
  .bib-category { margin-bottom: 28px; }
  .bib-category-title {
    font-family: var(--font-mono); font-size: 12px; font-weight: 500;
    color: var(--gold); letter-spacing: 0.06em; text-transform: uppercase;
    margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid var(--border);
  }
  .bib-item {
    font-size: 14px; line-height: 1.7; color: var(--ink2); font-weight: 300;
    padding: 7px 0 7px 16px; border-left: 2px solid var(--bg3);
    margin-bottom: 6px; direction: auto;
    transition: border-color 0.15s, padding-left 0.15s;
  }
  .bib-item:hover { border-left-color: var(--gold); padding-left: 20px; }

  /* ── RESPONSIVE ── */
  @media (max-width: 768px) {
    .cover { padding: 60px 28px 52px; }
    .cover-meta { flex-wrap: wrap; gap: 20px; }
    .content { padding: 36px 24px; }
    .main { margin-left: 0 !important; }
    .sidebar { width: 280px; }
    :root { --sidebar-w: 280px; }
  }
`;

// ─── Components ───────────────────────────────────────────────────────────────

function Sidebar({ data, activeId, onSelect, open }) {
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    // auto-expand active section
    data.sections.forEach(s => {
      if (s.id === activeId || s.subsections?.some(ss => ss.id === activeId)) {
        setExpanded(e => ({ ...e, [s.id]: true }));
      }
    });
  }, [activeId]);

  const toggle = (id) => setExpanded(e => ({ ...e, [id]: !e[id] }));

  return (
    <nav className={`sidebar${open ? "" : " closed"}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <IconBook />
          <span>Magistrlik Dissertatsiyasi</span>
        </div>
        <div className="sidebar-title">{data.meta.author}</div>
      </div>
      <div className="sidebar-nav">
        {data.sections.map(section => {
          const hasSubs = section.subsections?.length > 0;
          const isExp = expanded[section.id];
          return (
            <div key={section.id} className="nav-section">
              <button
                className={`nav-section-btn${activeId === section.id ? " active" : ""}`}
                onClick={() => { onSelect(section.id); hasSubs && toggle(section.id); }}
              >
                <span className="nav-section-label">{section.title}</span>
                {hasSubs && <IconChevron open={isExp} />}
              </button>
              {hasSubs && isExp && (
                <div className="nav-sub">
                  {section.subsections.map(sub => (
                    <button
                      key={sub.id}
                      className={`nav-sub-item${activeId === sub.id ? " active" : ""}`}
                      onClick={() => onSelect(sub.id)}
                    >
                      {sub.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}

function Cover({ meta }) {
  return (
    <div className="cover">
      <div className="cover-ornament" />
      <div className="cover-content">
        <div className="cover-institution">{meta.institution}</div>
        <div className="cover-dept">{meta.department}</div>
        <div className="cover-divider" />
        <h1 className="cover-title">{meta.title}</h1>
        <div className="cover-author">{meta.author}</div>
        <div className="cover-specialty">{meta.specialty}</div>
        <div className="cover-meta">
          <div className="cover-meta-item">
            <strong>Ilmiy rahbar</strong>{meta.supervisor}
          </div>
          <div className="cover-meta-item">
            <strong>Shahar / Yil</strong>{meta.city} – {meta.year}
          </div>
          <div className="cover-meta-item">
            <strong>UDK</strong>{meta.udk}
          </div>
        </div>
      </div>
    </div>
  );
}

function Prose({ text }) {
  return (
    <div className="prose">
      {text.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
    </div>
  );
}

function SectionIntro({ section }) {
  return (
    <div className="section">
      <div className="section-heading">
        <span className="section-number">Kirish</span>
        <div className="section-divider" />
        <h2 className="section-title">{section.title}</h2>
      </div>
      {section.subsections.map(sub => (
        <div key={sub.id} id={sub.id} className="subsection">
          <div className="subsection-title">{sub.title}</div>
          <Prose text={sub.content} />
          {sub.tasks && (
            <>
              <p style={{marginTop:18,marginBottom:8,fontWeight:600,fontSize:14,color:"var(--ink2)"}}>Tadqiqot vazifalari:</p>
              <ul className="feature-list">
                {sub.tasks.map((t,i) => <li key={i}>{t}</li>)}
              </ul>
            </>
          )}
          {sub.novelty && (
            <>
              <p style={{marginTop:18,marginBottom:8,fontWeight:600,fontSize:14,color:"var(--ink2)"}}>Ilmiy yangilik:</p>
              <ul className="feature-list">
                {sub.novelty.map((n,i) => <li key={i}>{n}</li>)}
              </ul>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

function SectionChapter({ section }) {
  return (
    <div className="section">
      <div className="section-heading">
        <span className="section-number">{section.number}-BOB</span>
        <div className="section-divider" />
        <h2 className="section-title">{section.title}</h2>
      </div>
      {section.subsections.map(sub => (
        <div key={sub.id} id={sub.id} className="subsection">
          <div className="subsection-title">
            {sub.title}
            {sub.pages && <span className="subsection-pages">(b. {sub.pages})</span>}
          </div>
          <Prose text={sub.content} />
        </div>
      ))}
      {section.conclusion && (
        <div className="conclusion-box">
          <strong>Bob xulosasi</strong>
          {section.conclusion}
        </div>
      )}
    </div>
  );
}

function SectionConclusion({ section }) {
  return (
    <div className="section">
      <div className="section-heading">
        <span className="section-number">Yakuniy</span>
        <div className="section-divider" />
        <h2 className="section-title">{section.title}</h2>
      </div>
      {section.points.map((p, i) => (
        <div key={i} className="conclusion-point">
          <div className="conclusion-point-num">{p.number}:</div>
          <div className="conclusion-point-text">{p.content}</div>
        </div>
      ))}
    </div>
  );
}

function SectionBibliography({ section }) {
  return (
    <div className="section">
      <div className="section-heading">
        <span className="section-number">Adabiyotlar</span>
        <div className="section-divider" />
        <h2 className="section-title">{section.title}</h2>
      </div>
      {section.categories.map(cat => (
        <div key={cat.id} className="bib-category">
          <div className="bib-category-title">{cat.title}</div>
          {cat.items.map((item, i) => (
            <div key={i} className="bib-item">{item}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

function renderSection(section) {
  if (section.type === "intro") return <SectionIntro key={section.id} section={section} />;
  if (section.type === "chapter") return <SectionChapter key={section.id} section={section} />;
  if (section.type === "conclusion") return <SectionConclusion key={section.id} section={section} />;
  if (section.type === "bibliography") return <SectionBibliography key={section.id} section={section} />;
  return null;
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [data, setData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    fetch(DATA_URL)
      .then(r => r.json())
      .then(d => { setData(d); setActiveId(d.sections[0]?.id); })
      .catch(() => {
        // fallback: embedded mini data
        setData({ meta: { title: "Dissertatsiya yuklanmadi", author: "", institution: "", department: "", specialty: "", supervisor: "", city: "", year: "", udk: "" }, sections: [] });
      });
  }, []);

  const handleSelect = (id) => {
    setActiveId(id);
    const el = document.getElementById(id);
    if (el) { el.scrollIntoView({ behavior: "smooth", block: "start" }); }
    else {
      // scroll to section
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  if (!data) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh",
      fontFamily:"Georgia,serif", color:"#5c3d1e", fontSize:16 }}>
      Yuklanmoqda...
    </div>
  );

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <Sidebar data={data} activeId={activeId} onSelect={handleSelect} open={sidebarOpen} />
        <button
          className={`sidebar-toggle${sidebarOpen ? " open" : ""}`}
          onClick={() => setSidebarOpen(o => !o)}
          title={sidebarOpen ? "Yopish" : "Ochish"}
        >
          {sidebarOpen ? <IconClose /> : <IconMenu />}
        </button>
        <main className={`main${sidebarOpen ? "" : " full"}`}>
          <Cover meta={data.meta} />
          <div className="content">
            {data.sections.map(s => renderSection(s))}
          </div>
        </main>
      </div>
    </>
  );
}
