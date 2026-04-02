import { useState, useEffect } from "react";

// ── Storage ───────────────────────────────────────────────────────────────────
function getTodayKey() { return new Date().toISOString().split("T")[0]; }
function getYesterdayKey() { const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().split("T")[0]; }
function load() { try { return JSON.parse(localStorage.getItem("ritual_v3") || "{}"); } catch { return {}; } }
function save(data) { try { localStorage.setItem("ritual_v3", JSON.stringify(data)); } catch {} }

const DEFAULT_HABITS = [
  { id: 1, name: "Work Out",    icon: "🏋️", target: 60 },
  { id: 2, name: "Read Bible",  icon: "✝️",  target: 30 },
  { id: 3, name: "Read",        icon: "📖",  target: 20 },
  { id: 4, name: "Journal",     icon: "✍️",  target: 15 },
  { id: 5, name: "Cold Shower", icon: "❄️",  target: 10 },
];

const TROPHY_MILESTONES = [7, 14, 30, 60, 100];
const ICONS = ["⚡","🏃","🧘","💧","🥗","😴","🎯","💪","📚","🎸","🧠","🌅","🏊","🚴","🥊","🧗","🏄","🎾"];

// ── Components ────────────────────────────────────────────────────────────────
function DotGrid({ streak, target = 30 }) {
  const cols = 7, rows = Math.ceil(target / cols), total = cols * rows;
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols},1fr)`, gap: 3 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width: 6, height: 6, borderRadius: 2,
          background: i < streak ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.15)",
          transition: `background 0.3s ${i * 0.01}s`,
        }} />
      ))}
    </div>
  );
}

function CircularProgress({ pct }) {
  const r = 44, c = 2 * Math.PI * r, dash = (pct / 100) * c;
  return (
    <svg width={110} height={110} style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
      <circle cx={55} cy={55} r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={8} />
      <circle cx={55} cy={55} r={r} fill="none" stroke="white" strokeWidth={8}
        strokeDasharray={`${dash} ${c}`} strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.6s cubic-bezier(0.34,1.56,0.64,1)" }} />
      <text x={55} y={55} textAnchor="middle" dominantBaseline="central"
        style={{
          fill: "white", fontSize: 20, fontWeight: 800,
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          transform: "rotate(90deg)", transformOrigin: "55px 55px",
        }}>{pct}%</text>
    </svg>
  );
}

function Particles({ active }) {
  if (!active) return null;
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 200, overflow: "hidden" }}>
      {Array.from({ length: 55 }).map((_, i) => {
        const angle = Math.random() * 360, dist = 150 + Math.random() * 280;
        return (
          <div key={i} style={{
            position: "absolute", left: "50%", top: "40%",
            width: 8 + Math.random() * 9, height: 8 + Math.random() * 9,
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            background: `hsl(${Math.random() * 60 + 10},100%,${60 + Math.random() * 20}%)`,
            animation: `pflyv3 ${0.8 + Math.random() * 0.7}s ${Math.random() * 0.3}s ease-out forwards`,
            "--tx": `${Math.cos(angle * Math.PI / 180) * dist}px`,
            "--ty": `${Math.sin(angle * Math.PI / 180) * dist}px`,
          }} />
        );
      })}
    </div>
  );
}

// ── Welcome Screen ────────────────────────────────────────────────────────────
function WelcomeScreen({ onEnter }) {
  const [phase, setPhase] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setPhase(1), 200);
    return () => clearTimeout(t);
  }, []);

  function handleEnter() {
    setExiting(true);
    setTimeout(onEnter, 550);
  }

  const features = [
    { icon: "🔥", text: "Track daily streaks" },
    { icon: "🏆", text: "Unlock milestone trophies" },
    { icon: "📊", text: "Visualize your progress" },
  ];

  return (
    <div style={{
      minHeight: "100dvh",
      background: "linear-gradient(160deg,#1a0a00 0%,#2d0f00 45%,#1a1a2e 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "'Plus Jakarta Sans',sans-serif", color: "#fff",
      position: "relative", overflow: "hidden",
      padding: "0 28px",
      paddingTop: "var(--sat)",
      paddingBottom: "var(--sab)",
      opacity: exiting ? 0 : 1,
      transform: exiting ? "scale(1.05)" : "scale(1)",
      transition: "opacity 0.5s ease, transform 0.5s ease",
    }}>
      {/* Orbs */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: "-10%", left: "-10%", width: 380, height: 380, borderRadius: "50%",
          background: "radial-gradient(circle,rgba(255,80,0,0.22) 0%,transparent 70%)",
          animation: "orbFloat1 8s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "-5%", right: "-15%", width: 320, height: 320, borderRadius: "50%",
          background: "radial-gradient(circle,rgba(180,50,255,0.14) 0%,transparent 70%)",
          animation: "orbFloat2 10s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", top: "55%", left: "55%", width: 200, height: 200, borderRadius: "50%",
          background: "radial-gradient(circle,rgba(255,180,0,0.1) 0%,transparent 70%)",
          animation: "orbFloat3 7s ease-in-out infinite",
        }} />
      </div>

      {/* Dot texture */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(circle,rgba(255,255,255,0.055) 1px,transparent 1px)",
        backgroundSize: "28px 28px",
        maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%,black,transparent)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%,black,transparent)",
      }} />

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 10,
        display: "flex", flexDirection: "column", alignItems: "center",
        textAlign: "center", width: "100%", maxWidth: 360,
        opacity: phase >= 1 ? 1 : 0,
        transform: phase >= 1 ? "translateY(0)" : "translateY(28px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}>

        {/* Logo */}
        <div style={{
          width: 92, height: 92, borderRadius: 30, marginBottom: 24,
          background: "linear-gradient(135deg,#ff6a00,#ff3d00)",
          boxShadow: "0 8px 40px rgba(255,80,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 44, animation: "logoFloat 4s ease-in-out infinite",
        }}>🔥</div>

        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase",
          color: "rgba(255,140,0,0.85)", marginBottom: 10,
          animation: "fadeSlideUp 0.6s 0.15s both",
        }}>Welcome To</div>

        <h1 style={{
          fontSize: 58, fontWeight: 800, lineHeight: 1, margin: "0 0 10px",
          letterSpacing: "-2px",
          background: "linear-gradient(135deg,#fff 30%,rgba(255,160,80,0.95) 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          animation: "fadeSlideUp 0.6s 0.25s both",
        }}>Ritual</h1>

        <p style={{
          fontSize: 16, color: "rgba(255,255,255,0.42)", fontWeight: 500,
          margin: "0 0 40px", lineHeight: 1.6, maxWidth: 240,
          animation: "fadeSlideUp 0.6s 0.35s both",
        }}>Build streaks. Stay locked in.<br />Become who you want to be.</p>

        {/* Feature pills */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", marginBottom: 44 }}>
          {features.map((f, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "13px 18px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16, backdropFilter: "blur(12px)",
              animation: `fadeSlideUp 0.6s ${0.45 + i * 0.1}s both`,
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                background: "rgba(255,100,0,0.18)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
              }}>{f.icon}</div>
              <span style={{ fontSize: 15, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{f.text}</span>
              <div style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "rgba(255,120,0,0.6)" }} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={handleEnter}
          style={{
            width: "100%", padding: "20px 0",
            background: "linear-gradient(135deg,#ff6a00,#ff3d00)",
            border: "none", borderRadius: 20, color: "#fff",
            fontSize: 18, fontWeight: 800, cursor: "pointer",
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            letterSpacing: "0.04em",
            boxShadow: "0 8px 32px rgba(255,80,0,0.45), 0 0 0 1px rgba(255,255,255,0.08)",
            animation: "fadeSlideUp 0.6s 0.75s both",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            WebkitAppearance: "none",
          }}
        >
          Get Started <span style={{ fontSize: 20 }}>→</span>
        </button>

        <p style={{
          fontSize: 11, color: "rgba(255,255,255,0.18)", marginTop: 18, fontWeight: 600,
          letterSpacing: "0.06em", textTransform: "uppercase",
          animation: "fadeSlideUp 0.6s 0.9s both",
        }}>Free forever · No account needed</p>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const stored = load();
  const [screen, setScreen]       = useState(stored.hasVisited ? "app" : "welcome");
  const [appVisible, setAppVisible] = useState(!!stored.hasVisited);
  const today     = getTodayKey();
  const yesterday = getYesterdayKey();

  const [habits, setHabits]           = useState(stored.habits || DEFAULT_HABITS);
  const [completed, setCompleted]     = useState(stored[today]?.completed || []);
  const [streaks, setStreaks]         = useState(stored.streaks || {});
  const [tab, setTab]                 = useState("home");
  const [celebrating, setCelebrating] = useState(false);
  const [prevDone, setPrevDone]       = useState((stored[today]?.completed || []).length);
  const [newName, setNewName]         = useState("");
  const [newIcon, setNewIcon]         = useState("⚡");
  const [addSuccess, setAddSuccess]   = useState(false);

  const done    = completed.length;
  const total   = habits.length;
  const pct     = total > 0 ? Math.round((done / total) * 100) : 0;
  const allDone = done === total && total > 0;

  useEffect(() => {
    const s = load();
    s.habits = habits; s.streaks = streaks;
    s[today] = { completed }; s.hasVisited = true;
    save(s);
  }, [habits, completed, streaks]);

  useEffect(() => {
    if (allDone && done > prevDone) {
      setCelebrating(true);
      setTimeout(() => setCelebrating(false), 1600);
    }
    setPrevDone(done);
  }, [done]);

  function handleEnter() {
    setScreen("app");
    setTimeout(() => setAppVisible(true), 60);
  }

  function toggle(id) {
    setCompleted(prev => {
      const on   = prev.includes(id);
      const next = on ? prev.filter(x => x !== id) : [...prev, id];
      if (!on) setStreaks(s => {
        const wasYest = (load()[yesterday]?.completed || []).includes(id);
        return { ...s, [id]: wasYest ? (s[id] || 0) + 1 : 1 };
      });
      return next;
    });
  }

  function removeHabit(id) {
    setHabits(h => h.filter(x => x.id !== id));
    setCompleted(c => c.filter(x => x !== id));
  }

  function addHabit() {
    if (!newName.trim()) return;
    setHabits(h => [...h, { id: Date.now(), name: newName.trim(), icon: newIcon, target: 30 }]);
    setNewName(""); setNewIcon("⚡");
    setAddSuccess(true); setTimeout(() => setAddSuccess(false), 1500);
  }

  const greeting = (() => {
    const h = new Date().getHours();
    return h < 12 ? "Good Morning" : h < 17 ? "Good Afternoon" : "Good Evening";
  })();

  const trophyData = habits.map(h => ({
    ...h, streak: streaks[h.id] || 0,
    badges: TROPHY_MILESTONES.map(m => ({ days: m, unlocked: (streaks[h.id] || 0) >= m })),
  }));

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    @keyframes pflyv3{0%{transform:translate(0,0) scale(1);opacity:1}100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0}}
    @keyframes fadeSlideUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
    @keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
    @keyframes glowPulse{0%,100%{box-shadow:0 0 30px rgba(255,120,0,0.4)}50%{box-shadow:0 0 60px rgba(255,120,0,0.8)}}
    @keyframes checkBounce{0%{transform:scale(0)}60%{transform:scale(1.25)}100%{transform:scale(1)}}
    @keyframes logoFloat{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-10px) rotate(2deg)}}
    @keyframes orbFloat1{0%,100%{transform:translate(0,0)}50%{transform:translate(30px,20px)}}
    @keyframes orbFloat2{0%,100%{transform:translate(0,0)}50%{transform:translate(-20px,-30px)}}
    @keyframes orbFloat3{0%,100%{transform:translate(0,0)}50%{transform:translate(-15px,15px)}}
    .hcard{transition:transform 0.18s cubic-bezier(0.34,1.56,0.64,1);cursor:pointer;-webkit-tap-highlight-color:transparent;}
    .hcard:active{transform:scale(0.97)!important}
    .tab-btn{transition:all 0.2s;cursor:pointer;border:none;outline:none;background:none;-webkit-tap-highlight-color:transparent;}
    input::placeholder{color:rgba(255,255,255,0.25);}
    input{caret-color:#ff6a00;}
  `;

  if (screen === "welcome") return (
    <>
      <style>{CSS}</style>
      <WelcomeScreen onEnter={handleEnter} />
    </>
  );

  return (
    <div style={{
      minHeight: "100dvh", maxWidth: 430, margin: "0 auto",
      background: "linear-gradient(160deg,#1a0a00 0%,#2d0f00 40%,#1a1a2e 100%)",
      fontFamily: "'Plus Jakarta Sans',sans-serif", color: "#fff",
      position: "relative", overflowX: "hidden",
      opacity: appVisible ? 1 : 0,
      transform: appVisible ? "translateY(0)" : "translateY(20px)",
      transition: "opacity 0.5s ease, transform 0.5s ease",
    }}>
      <style>{CSS}</style>
      <Particles active={celebrating} />

      {/* BG orbs */}
      <div style={{ position: "fixed", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle,rgba(255,100,0,0.18) 0%,transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: 100, left: -60, width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle,rgba(120,60,255,0.12) 0%,transparent 70%)", pointerEvents: "none" }} />

      {/* ── HOME ── */}
      {tab === "home" && (
        <div style={{ padding: "calc(var(--sat) + 44px) 20px calc(var(--sab) + 88px)" }}>
          <div style={{ marginBottom: 24, animation: "fadeSlideUp 0.5s both" }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 600, letterSpacing: "0.05em", marginBottom: 4 }}>
              {greeting}, Grayson 👋
            </p>
            <h1 style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.2 }}>
              {allDone ? "🔥 Day Complete. Beast." : "Keep the streak alive,\nspark your motivation."}
            </h1>
          </div>

          {/* Progress card */}
          <div style={{
            background: "linear-gradient(135deg,rgba(255,90,0,0.85),rgba(220,60,0,0.7))",
            borderRadius: 24, padding: "22px 20px", marginBottom: 18,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            backdropFilter: "blur(20px)",
            boxShadow: allDone ? "0 8px 40px rgba(255,100,0,0.5)" : "0 8px 32px rgba(0,0,0,0.3)",
            animation: allDone ? "glowPulse 2s infinite" : "fadeSlideUp 0.5s 0.1s both",
          }}>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, opacity: 0.7, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Today's Progress</p>
              <p style={{ fontSize: 36, fontWeight: 800, lineHeight: 1 }}>{done}<span style={{ fontSize: 18, opacity: 0.6 }}>/{total}</span></p>
              <p style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>habits completed</p>
              {allDone && (
                <p style={{
                  fontSize: 13, marginTop: 8, fontWeight: 700,
                  background: "linear-gradient(90deg,#fff,#ffe4b3)", backgroundSize: "200%",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  animation: "shimmer 2s linear infinite",
                }}>🏆 PERFECT DAY!</p>
              )}
            </div>
            <CircularProgress pct={pct} />
          </div>

          {/* Habit cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {habits.map((h, idx) => {
              const isDone = completed.includes(h.id), streak = streaks[h.id] || 0;
              return (
                <div key={h.id} className="hcard" onClick={() => toggle(h.id)} style={{
                  background: isDone ? "linear-gradient(135deg,rgba(255,255,255,0.12),rgba(255,255,255,0.06))" : "rgba(255,255,255,0.05)",
                  border: `1px solid ${isDone ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.07)"}`,
                  borderRadius: 20, padding: "15px 16px",
                  position: "relative", overflow: "hidden",
                  animation: `fadeSlideUp 0.5s ${0.15 + idx * 0.07}s both`,
                  backdropFilter: "blur(10px)",
                }}>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: isDone ? "linear-gradient(180deg,#ff8c00,#ff4500)" : "transparent", borderRadius: "20px 0 0 20px", transition: "background 0.3s" }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 13, flexShrink: 0, background: isDone ? "rgba(255,120,0,0.25)" : "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 21, transition: "all 0.3s", boxShadow: isDone ? "0 4px 16px rgba(255,100,0,0.3)" : "none" }}>
                      {h.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: isDone ? "rgba(255,255,255,0.5)" : "#fff", textDecoration: isDone ? "line-through" : "none", transition: "all 0.3s" }}>{h.name}</span>
                        {streak > 0 && <span style={{ fontSize: 11, fontWeight: 700, color: "#ff8c00", background: "rgba(255,140,0,0.15)", borderRadius: 20, padding: "2px 7px", whiteSpace: "nowrap", flexShrink: 0 }}>🔥 {streak}d</span>}
                      </div>
                      <DotGrid streak={streak} target={h.target} />
                    </div>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", flexShrink: 0, border: `2px solid ${isDone ? "#ff6a00" : "rgba(255,255,255,0.15)"}`, background: isDone ? "linear-gradient(135deg,#ff6a00,#ff4500)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s" }}>
                      {isDone && <svg style={{ animation: "checkBounce 0.3s cubic-bezier(0.34,1.56,0.64,1)" }} width={13} height={13} viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    </div>
                  </div>
                  <div onClick={e => { e.stopPropagation(); removeHabit(h.id); }} style={{ position: "absolute", top: 8, right: 8, width: 18, height: 18, borderRadius: "50%", background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.3)", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TROPHIES ── */}
      {tab === "trophies" && (
        <div style={{ padding: "calc(var(--sat) + 44px) 20px calc(var(--sab) + 88px)" }}>
          <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 6, animation: "fadeSlideUp 0.4s both" }}>Trophies 🏆</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 28, animation: "fadeSlideUp 0.4s 0.05s both" }}>Hit streak milestones to unlock badges</p>
          {trophyData.map((h, hi) => (
            <div key={h.id} style={{ marginBottom: 28, animation: `fadeSlideUp 0.4s ${hi * 0.08}s both` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{h.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: 16 }}>{h.name}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#ff8c00", background: "rgba(255,140,0,0.15)", borderRadius: 20, padding: "3px 10px" }}>🔥 {h.streak} days</span>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {h.badges.map(b => (
                  <div key={b.days} style={{ flex: "1 1 70px", background: b.unlocked ? "linear-gradient(135deg,rgba(255,100,0,0.6),rgba(255,60,0,0.4))" : "rgba(255,255,255,0.04)", border: `1px solid ${b.unlocked ? "rgba(255,120,0,0.5)" : "rgba(255,255,255,0.08)"}`, borderRadius: 16, padding: "12px 8px", textAlign: "center", opacity: b.unlocked ? 1 : 0.5, transition: "all 0.3s" }}>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>{b.unlocked ? "🥇" : "🔒"}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: b.unlocked ? "#ffcf77" : "rgba(255,255,255,0.4)" }}>{b.days} Days</div>
                    <div style={{ fontSize: 10, color: b.unlocked ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)", marginTop: 2 }}>{b.unlocked ? "Unlocked" : "Locked"}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── ADD ── */}
      {tab === "add" && (
        <div style={{ padding: "calc(var(--sat) + 44px) 20px calc(var(--sab) + 88px)" }}>
          <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 6, animation: "fadeSlideUp 0.4s both" }}>Add Habit</h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 28, animation: "fadeSlideUp 0.4s 0.05s both" }}>Build the ritual, lock in the streak.</p>

          <div style={{ marginBottom: 20, animation: "fadeSlideUp 0.4s 0.1s both" }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 10 }}>Choose Icon</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: 8 }}>
              {ICONS.map(ic => (
                <div key={ic} onClick={() => setNewIcon(ic)} style={{ height: 48, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, cursor: "pointer", background: newIcon === ic ? "linear-gradient(135deg,rgba(255,100,0,0.6),rgba(255,60,0,0.4))" : "rgba(255,255,255,0.05)", border: `1px solid ${newIcon === ic ? "rgba(255,120,0,0.6)" : "rgba(255,255,255,0.07)"}`, transform: newIcon === ic ? "scale(1.05)" : "scale(1)", transition: "all 0.2s" }}>{ic}</div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 24, animation: "fadeSlideUp 0.4s 0.15s both" }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 10 }}>Habit Title</p>
            <input value={newName} onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addHabit()}
              placeholder="e.g. Morning Run..."
              style={{ width: "100%", padding: "16px 18px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, color: "#fff", fontSize: 16, fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 600, outline: "none", WebkitAppearance: "none" }} />
          </div>

          <button onClick={addHabit} style={{ width: "100%", padding: "18px", background: addSuccess ? "linear-gradient(135deg,#00c96e,#00a357)" : "linear-gradient(135deg,#ff6a00,#ff4500)", border: "none", borderRadius: 18, color: "#fff", fontSize: 17, fontWeight: 800, cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: "0.03em", transition: "all 0.3s", animation: "fadeSlideUp 0.4s 0.2s both", boxShadow: addSuccess ? "0 4px 24px rgba(0,200,100,0.4)" : "0 4px 24px rgba(255,100,0,0.4)", WebkitAppearance: "none" }}>
            {addSuccess ? "✓ Habit Added!" : "Add Habit"}
          </button>

          <div style={{ marginTop: 28, animation: "fadeSlideUp 0.4s 0.25s both" }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 12 }}>Your Habits ({habits.length})</p>
            {habits.map(h => (
              <div key={h.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "rgba(255,255,255,0.04)", borderRadius: 14, marginBottom: 8, border: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontSize: 16 }}>{h.icon} <span style={{ fontWeight: 600, marginLeft: 4 }}>{h.name}</span></span>
                <div onClick={() => removeHabit(h.id)} style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,80,80,0.15)", color: "rgba(255,100,100,0.8)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14 }}>×</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Bottom Nav ── */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        background: "rgba(10,5,0,0.9)", backdropFilter: "blur(24px)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        paddingTop: 12, paddingBottom: "calc(var(--sab) + 12px)",
        display: "flex", justifyContent: "space-around", alignItems: "center", zIndex: 50,
      }}>
        {[
          { id: "home", icon: "🔥", label: "Today" },
          { id: "trophies", icon: "🏆", label: "Trophies" },
          { id: "add", icon: "＋", label: "Add" },
        ].map(t => (
          <button key={t.id} className="tab-btn" onClick={() => setTab(t.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, color: tab === t.id ? "#ff6a00" : "rgba(255,255,255,0.3)", padding: "6px 24px", borderRadius: 16, background: tab === t.id ? "rgba(255,100,0,0.12)" : "transparent", transition: "all 0.2s" }}>
            <span style={{ fontSize: t.id === "add" ? 22 : 18, lineHeight: 1 }}>{t.icon}</span>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.04em" }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
