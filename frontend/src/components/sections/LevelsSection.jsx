import { useEffect, useRef, useState } from "react";
import { SectionHeader } from "../ui/UIKit";

const LEVELS = [
  { n:1, color:"#22c55e", bg:"rgba(34,197,94,.06)", border:"rgba(34,197,94,.2)", status:"EASY", sys:"NAVIGATION SYSTEM", icon:"🧭",
    title:"Navigation System Failure",
    crisis:"GPS and navigation module corrupted. The ship cannot stabilise its direction toward Earth. Without recalibration, you will drift off-course permanently.",
    fixes:["Restores Navigation AI calibration","Stabilises basic direction control","Enables partial course correction toward Earth"],
    subjects:["Basic Physics (motion, speed)","Easy Math Logic","Basic Computing Logic"],
    outcome:"Navigation system partially restored. The ship is now stable but not fully controlled." },
  { n:2, color:"#4ade80", bg:"rgba(74,222,128,.05)", border:"rgba(74,222,128,.18)", status:"EASY", sys:"POWER DISTRIBUTION", icon:"⚡",
    title:"Power Distribution Failure",
    crisis:"Power system went unstable during the navigation reboot. Energy is leaking from the primary grid, systems are shutting down at random, and the backup battery is critically mis-optimised.",
    fixes:["Restores primary power distribution grid","Stabilises energy flow to critical systems","Activates backup reactor partially"],
    subjects:["Basic Circuits & Energy","Computer Logic","Chemistry (energy reactions)"],
    outcome:"Power grid stabilised. Energy flow is now controlled but not fully optimised." },
  { n:3, color:"#f59e0b", bg:"rgba(245,158,11,.05)", border:"rgba(245,158,11,.18)", status:"MEDIUM", sys:"COMMUNICATION ARRAY", icon:"📡",
    title:"Communication System Breakdown",
    crisis:"The ship cannot contact Earth or Mission Control. The signal antenna is damaged, data transmission is corrupt, and the AI communication module is destabilising. You are completely isolated.",
    fixes:["Repairs communication antenna alignment","Restores partial Earth connection","AI assistant becomes more stable"],
    subjects:["Medium Physics (waves, signals)","Computer Science logic","Signal transmission chemistry"],
    outcome:"Communication restored. Mission Control is now receiving weak signals." },
  { n:4, color:"#f97316", bg:"rgba(249,115,22,.05)", border:"rgba(249,115,22,.18)", status:"MEDIUM", sys:"LIFE SUPPORT CRITICAL", icon:"🫁",
    title:"Life Support System Critical Failure",
    crisis:"Life support is failing. Oxygen levels are destabilising, temperature control is broken, and cabin pressure is fluctuating. Without a fix in the next 15 minutes, crew survival is not guaranteed.",
    fixes:["Restores oxygen regulation system","Stabilises cabin pressure","Improves temperature control"],
    subjects:["Medium-Hard Physics (pressure, gases)","Chemistry (oxygen systems)","Logical problem solving"],
    outcome:"Life support stabilised. Crew survival is now secured." },
  { n:5, color:"#e53935", bg:"rgba(229,57,53,.07)", border:"rgba(229,57,53,.25)", status:"HARD", sys:"ENGINE CORE & LANDING", icon:"🔥",
    title:"Engine Core & Landing System Failure",
    crisis:"Main engine and landing systems are critically damaged. Thrusters are not firing correctly. The re-entry heat shield is unstable. The landing trajectory is misaligned. This is the final and hardest repair.",
    fixes:["Repairs engine core stabilisation system","Restores re-entry control","Activates Earth landing sequence"],
    subjects:["Hard Math + Physics integration","Advanced logic problems","Multi-step reasoning"],
    outcome:"Engine restored. Re-entry sequence initiated. Welcome home, Cadet." },
];

const LevelCard = ({ lv, index }) => {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: .1 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ display:"flex", gap:"2rem", marginBottom:"2.5rem", opacity: vis?1:0, transform: vis?"translateY(0)":"translateY(24px)", transition:`opacity .55s ease ${index*.1}s,transform .55s ease ${index*.1}s` }}>
      {/* Node */}
      <div style={{ flexShrink:0, width:70, display:"flex", flexDirection:"column", alignItems:"center", gap:".4rem", paddingTop:".2rem" }}>
        <div style={{ width:56, height:56, borderRadius:"50%", background:lv.bg, border:`1px solid ${lv.border}`, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", flexShrink:0 }}>
          <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:`1.5px solid ${lv.color}`, opacity:.3, animation:"rotate-slow 12s linear infinite", borderTopColor:"transparent" }} />
          <span className="font-display" style={{ fontSize:"1.1rem", fontWeight:800, color:lv.color, zIndex:1 }}>{lv.n}</span>
        </div>
        <span className="font-mono" style={{ fontSize:".52rem", letterSpacing:".12em", padding:"2px 7px", borderRadius:1, textTransform:"uppercase", border:`1px solid ${lv.border}`, color:lv.color, background:lv.bg, whiteSpace:"nowrap" }}>{lv.status}</span>
      </div>

      {/* Card */}
      <div style={{ flex:1, background:"var(--bg-card)", borderRadius:6, border:`1px solid ${lv.border}`, overflow:"hidden", transition:"border-color .3s,box-shadow .3s,background .3s", cursor:"default" }}
        onMouseEnter={e=>{ e.currentTarget.style.background="#141920"; e.currentTarget.style.boxShadow="0 8px 32px rgba(0,0,0,.5)"; e.currentTarget.style.borderColor=lv.color+"66"; }}
        onMouseLeave={e=>{ e.currentTarget.style.background="var(--bg-card)"; e.currentTarget.style.boxShadow=""; e.currentTarget.style.borderColor=lv.border; }}>
        <div style={{ height:3, background:`linear-gradient(90deg,transparent,${lv.color},transparent)` }} />
        <div style={{ padding:"1.5rem 1.75rem 1.2rem" }}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"1rem", marginBottom:".75rem" }}>
            <div>
              <div className="font-mono" style={{ fontSize:".57rem", color:lv.color, letterSpacing:".16em", textTransform:"uppercase", marginBottom:".3rem" }}>◈ SYSTEM {lv.n} OF 5 — {lv.sys}</div>
              <h3 className="font-display" style={{ fontSize:"1.15rem", fontWeight:700, textTransform:"uppercase", letterSpacing:".04em", color:"var(--white)", lineHeight:1.2 }}>Level {lv.n}: {lv.title}</h3>
            </div>
            <span style={{ fontSize:"2rem", flexShrink:0 }}>{lv.icon}</span>
          </div>
          <div style={{ background:"rgba(229,57,53,.05)", border:"1px solid rgba(229,57,53,.12)", borderRadius:3, padding:".7rem .9rem", marginBottom:".9rem", fontFamily:"var(--font-mono)", fontSize:".72rem", color:"var(--grey-200)", lineHeight:1.65, letterSpacing:".03em" }}>
            <div className="font-mono" style={{ fontSize:".57rem", color:"var(--red-400)", letterSpacing:".16em", textTransform:"uppercase", marginBottom:".35rem", display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ width:5, height:5, borderRadius:"50%", background:"var(--red-400)", animation:"pulse-red 1.4s infinite", flexShrink:0 }} />SYSTEM FAILURE REPORT
            </div>
            {lv.crisis}
          </div>
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:".4rem", padding:"0 1.75rem 1.2rem" }}>
          {lv.fixes.map(f => (
            <span key={f} className="font-mono" style={{ fontSize:".6rem", letterSpacing:".08em", padding:"3px 9px", borderRadius:2, border:`1px solid ${lv.border}`, color:lv.color, background:lv.bg, display:"flex", alignItems:"center", gap:5 }}>✔ {f}</span>
          ))}
        </div>
        <div style={{ padding:"0 1.75rem 1.5rem" }}>
          <div className="font-mono" style={{ fontSize:".57rem", color:"var(--grey-400)", letterSpacing:".14em", textTransform:"uppercase", marginBottom:".5rem" }}>Challenge Subjects</div>
          <div style={{ display:"flex", gap:".4rem", flexWrap:"wrap" }}>
            {lv.subjects.map(s => (
              <span key={s} className="font-mono" style={{ fontSize:".6rem", color:"var(--grey-300)", background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.08)", borderRadius:2, padding:"3px 9px", letterSpacing:".06em" }}>{s}</span>
            ))}
          </div>
        </div>
        <div style={{ padding:".9rem 1.75rem", background:"rgba(0,0,0,.3)", borderTop:"1px solid rgba(255,255,255,.04)", fontFamily:"var(--font-mono)", fontSize:".72rem", color:"var(--grey-300)", lineHeight:1.55, fontStyle:"italic", letterSpacing:".02em" }}>
          "{lv.outcome}"
        </div>
      </div>
    </div>
  );
};

const LevelsSection = () => (
  <section id="levels" style={{ position:"relative", zIndex:10, padding:"6rem 0" }}>
    <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 1.75rem" }}>
      <SectionHeader tag="MISSION LEVELS" title="5 SYSTEMS TO" highlight="REPAIR"
        subtitle="Each level is a broken spacecraft system. Solve the STEM challenges to fix it and push one step closer to Earth. Fail the timer or score, and you drift further into the void." />
      <div style={{ position:"relative" }}>
        <div style={{ position:"absolute", left:34, top:0, bottom:0, width:1, background:"linear-gradient(180deg,var(--red-500),var(--amber-400,#ffb300) 50%,var(--red-500))", opacity:.2 }} />
        {LEVELS.map((lv, i) => <LevelCard key={lv.n} lv={lv} index={i} />)}
      </div>
    </div>
    <style>{`@keyframes rotate-slow{to{transform:rotate(360deg)}}`}</style>
  </section>
);
export default LevelsSection;
