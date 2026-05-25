import { useEffect, useRef, useState } from "react";
import { SectionHeader, HUDTag } from "../ui/UIKit";

const CHAT = [
  { from:"system", text:"⚠ WRONG ANSWER DETECTED — AI COPILOT ENGAGED", delay:0 },
  { from:"user",   text:"Why is my answer wrong? What are radio waves?", delay:700 },
  { from:"ai",     text:"No problem, Cadet. Radio waves are electromagnetic radiation — same family as light, just much lower frequency. You mixed up frequency with wavelength: higher f = shorter λ, not longer.", delay:1700 },
  { from:"user",   text:"Break it down step by step please.", delay:2900 },
  { from:"ai",     text:"Step 1: EM spectrum — radio, microwave, infrared, visible, UV, X-ray, gamma.\nStep 2: c = f × λ (speed of light = frequency × wavelength).\nStep 3: Radio waves → very low f, very long λ — that's why antennas are large.\nStep 4: Your answer swapped f and λ. ✓", delay:3800 },
  { from:"video",  text:'📹 Recommended: "Electromagnetic Waves Explained" — Khan Academy', delay:5000 },
];

const NODES = [
  { id:"01", icon:"🔍", title:"Intent Detection",   desc:"Hint request? Explanation? Mistake analysis?" },
  { id:"02", icon:"🧠", title:"Knowledge Engine",   desc:"Generates contextual response for the question" },
  { id:"03", icon:"📖", title:"Teaching Layer",     desc:"Step-by-step concept breakdown for the student" },
  { id:"04", icon:"🎥", title:"YouTube Tool Node",  desc:"Extracts topic and fetches relevant video links" },
  { id:"05", icon:"📤", title:"Response Formatter", desc:"Structured final output delivered to your screen" },
];

const AISection = () => {
  const chatRef = useRef(null);
  const msgsRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [msgs, setMsgs] = useState([]);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold:.4 });
    if (chatRef.current) io.observe(chatRef.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    CHAT.forEach((m, i) => {
      setTimeout(() => setMsgs(prev => [...prev, m]), m.delay);
    });
  }, [started]);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [msgs]);

  return (
    <section id="ai-section" style={{ position:"relative", zIndex:10, padding:"6rem 0" }}>
      <div style={{ position:"absolute", right:0, top:"20%", width:"40%", height:"60%", background:"radial-gradient(ellipse at right,rgba(229,57,53,.05),transparent 70%)", pointerEvents:"none" }} />
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 1.75rem" }}>
        <SectionHeader tag="AI COPILOT" title="YOUR SHIP'S AI IS" highlight="STILL ONLINE"
          subtitle="Partially damaged but functional. When you're stuck, the LangGraph AI copilot reads your mistake, explains it step-by-step, and pulls a YouTube video. You're not alone out there." />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"3.5rem", alignItems:"start" }} className="ai-layout">
          {/* Pipeline */}
          <div>
            <p className="font-mono" style={{ fontSize:".6rem", color:"var(--grey-400)", letterSpacing:".16em", marginBottom:"1.5rem" }}>◈ LANGGRAPH AGENT PIPELINE</p>
            {NODES.map((n, i) => (
              <div key={n.id} style={{ display:"flex", gap:"1.1rem" }}>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0, width:44 }}>
                  <div style={{ width:44, height:44, borderRadius:5, background:"var(--red-subtle)", border:"1px solid rgba(229,57,53,.22)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem" }}>{n.icon}</div>
                  {i < NODES.length - 1 && <div style={{ flex:1, width:1, background:"rgba(229,57,53,.15)", minHeight:20 }} />}
                </div>
                <div style={{ padding:".1rem 0 1.2rem" }}>
                  <div className="font-mono" style={{ fontSize:".56rem", color:"var(--red-400)", letterSpacing:".14em", marginBottom:2 }}>NODE {n.id}</div>
                  <div className="font-display" style={{ fontSize:".88rem", fontWeight:700, textTransform:"uppercase", letterSpacing:".04em", color:"var(--white)", marginBottom:2 }}>{n.title}</div>
                  <div className="font-body" style={{ fontSize:".8rem", color:"var(--grey-400)" }}>{n.desc}</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop:"1.8rem", display:"flex", flexWrap:"wrap", gap:".45rem" }}>
              {["Hint Generation","Error Analysis","Step-by-Step","YouTube Videos","Async via Celery"].map(c => (
                <span key={c} className="font-mono" style={{ fontSize:".62rem", color:"var(--grey-300)", background:"var(--bg-card)", border:"1px solid rgba(255,255,255,.07)", borderRadius:3, padding:"4px 10px" }}>{c}</span>
              ))}
            </div>
          </div>

          {/* Chat window */}
          <div ref={chatRef} style={{ background:"var(--bg-card)", border:"1px solid rgba(229,57,53,.15)", borderRadius:8, overflow:"hidden" }}>
            <div style={{ background:"rgba(8,10,12,.8)", borderBottom:"1px solid rgba(229,57,53,.1)", padding:".7rem 1.1rem", display:"flex", alignItems:"center", gap:".7rem" }}>
              <div style={{ display:"flex", gap:5 }}>
                {["#e53935","#ffb300","#4caf50"].map(c => <div key={c} style={{ width:9, height:9, borderRadius:"50%", background:c }} />)}
              </div>
              <span className="font-mono" style={{ fontSize:".6rem", color:"var(--grey-400)", letterSpacing:".08em" }}>AI COPILOT — LEVEL 3 · COMMS REPAIR</span>
              <div style={{ marginLeft:"auto" }}><HUDTag color="cyan">LIVE DEMO</HUDTag></div>
            </div>
            <div ref={msgsRef} style={{ padding:"1rem", minHeight:310, maxHeight:370, overflowY:"auto" }}>
              {msgs.map((m, i) => {
                if (m.from === "system") return (
                  <div key={i} style={{ textAlign:"center", marginBottom:".75rem", animation:"slide-in-up .35s ease" }}>
                    <span className="font-mono" style={{ fontSize:".6rem", color:"var(--red-400)", letterSpacing:".1em" }}>{m.text}</span>
                  </div>
                );
                const isAI = m.from === "ai";
                const isVid = m.from === "video";
                const bubbleStyle = isVid
                  ? { background:"var(--cyan-sub,rgba(0,229,255,.06))", border:"1px solid rgba(0,229,255,.18)", borderRadius:"4px 12px 12px 4px", color:"var(--cyan-400)" }
                  : isAI
                    ? { background:"var(--red-subtle)", border:"1px solid rgba(229,57,53,.18)", borderRadius:"4px 12px 12px 4px", color:"var(--white)" }
                    : { background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.09)", borderRadius:"12px 4px 4px 12px", color:"var(--grey-200)" };
                return (
                  <div key={i} style={{ marginBottom:".75rem", textAlign: m.from === "user" ? "right" : "left", animation:"slide-in-up .35s ease" }}>
                    <span style={{ ...bubbleStyle, padding:".65rem 1rem", fontFamily:"var(--font-body)", fontSize:".82rem", lineHeight:1.6, whiteSpace:"pre-line", display:"inline-block", maxWidth:"82%" }}>{m.text}</span>
                  </div>
                );
              })}
            </div>
            <div style={{ padding:".75rem 1rem", borderTop:"1px solid rgba(255,255,255,.05)", display:"flex", gap:".6rem", alignItems:"center" }}>
              <div style={{ flex:1, height:36, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:4, padding:"0 10px", display:"flex", alignItems:"center" }}>
                <span className="font-mono" style={{ fontSize:".72rem", color:"var(--grey-400)" }}>Ask AI for a hint...<span style={{ animation:"blink-cursor .9s step-end infinite" }}>|</span></span>
              </div>
              <div style={{ width:36, height:36, background:"var(--red-600)", borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center", fontSize:".75rem", flexShrink:0 }}>➤</div>
            </div>
          </div>
        </div>
      </div>
      <style>{`.ai-layout{@media(max-width:900px){grid-template-columns:1fr!important}}`}</style>
    </section>
  );
};
export default AISection;
