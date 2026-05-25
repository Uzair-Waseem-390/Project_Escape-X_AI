import { SectionHeader } from "../ui/UIKit";

const StorySection = () => (
  <section id="story" style={{ position:"relative", zIndex:10, padding:"6rem 0", background:"linear-gradient(180deg,transparent,rgba(229,57,53,.03) 30%,rgba(255,179,0,.02) 70%,transparent)" }}>
    <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 1.75rem" }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1.1fr", gap:"5rem", alignItems:"center" }} className="story-layout">
        {/* Text */}
        <div>
          <div style={{ marginBottom:"1.2rem" }}>
            <span className="hud-tag"><span style={{ width:6, height:6, borderRadius:"50%", background:"var(--red-400)", animation:"pulse-red 1.6s infinite", display:"inline-block", marginRight:7, flexShrink:0 }} />MISSION BRIEFING</span>
          </div>
          <h2 className="font-display" style={{ fontSize:"clamp(2rem,4vw,3.2rem)", fontWeight:800, textTransform:"uppercase", lineHeight:1.1, letterSpacing:".02em", color:"var(--white)", marginBottom:"1.4rem" }}>
            MARS. RESEARCH.<br />A LONG WAY <span className="gradient-text-red">HOME.</span>
          </h2>
          <p className="font-body" style={{ fontSize:"1rem", color:"var(--grey-300)", lineHeight:1.8, marginBottom:"1.2rem" }}>
            You are an astronaut completing a <strong style={{ color:"var(--grey-100,#e2e8f0)", fontWeight:600 }}>historic Mars research mission</strong>. You've collected rare soil samples that could rewrite the story of life in the universe.
          </p>
          <p className="font-body" style={{ fontSize:"1rem", color:"var(--grey-300)", lineHeight:1.8, marginBottom:"1.2rem" }}>
            Then — halfway through your return journey — <strong style={{ color:"var(--grey-100,#e2e8f0)", fontWeight:600 }}>everything goes wrong.</strong> The spacecraft enters Emergency Mode. Red lights. Alarms. Five critical systems shutting down one by one. Earth is still months away.
          </p>
          <p className="font-body" style={{ fontSize:"1rem", color:"var(--grey-300)", lineHeight:1.8, marginBottom:"1.6rem" }}>
            Your only way home? <strong style={{ color:"var(--grey-100,#e2e8f0)", fontWeight:600 }}>Your STEM knowledge.</strong> Solve the challenges to repair each broken system, restore the ship, and land safely on Earth with the samples intact.
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:".7rem" }}>
            {[
              { icon:"🔴", text:<><strong>Emergency Mode Active:</strong> Navigation, power, comms, life support, and engines are all compromised.</> },
              { icon:"🧪", text:<><strong>Mars Samples Onboard:</strong> Priceless research data that must survive the journey home.</> },
              { icon:"⏱", text:<><strong>15 Minutes Per System:</strong> Each repair has a strict time limit. Think fast, think smart.</> },
              { icon:"🤖", text:<><strong>AI Copilot Partially Online:</strong> Still functional enough to give hints, explain concepts, and find YouTube resources.</> },
            ].map((f, i) => (
              <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:".9rem", padding:".75rem 1rem", background:"var(--bg-card)", border:"1px solid rgba(255,255,255,.05)", borderRadius:4 }}>
                <span style={{ fontSize:"1.1rem", flexShrink:0, marginTop:".05rem" }}>{f.icon}</span>
                <span className="font-body" style={{ fontSize:".9rem", color:"var(--grey-200)", lineHeight:1.6 }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cockpit SVG diagram */}
        <div style={{ display:"flex", justifyContent:"center", alignItems:"center" }}>
          <svg viewBox="0 0 420 480" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ maxWidth:400, filter:"drop-shadow(0 0 40px rgba(229,57,53,0.12))" }}>
            <rect x="20" y="20" width="380" height="440" rx="12" stroke="rgba(229,57,53,0.2)" strokeWidth="1" fill="rgba(10,14,18,0.7)"/>
            <rect x="20" y="20" width="380" height="36" rx="12" fill="rgba(229,57,53,0.06)" stroke="rgba(229,57,53,0.18)" strokeWidth="0.5"/>
            <text x="210" y="43" textAnchor="middle" fill="#e53935" fontSize="9" fontFamily="Share Tech Mono" letterSpacing="3">SPACECRAFT AI — EMERGENCY MODE</text>
            <ellipse cx="210" cy="145" rx="120" ry="80" fill="rgba(0,20,40,0.8)" stroke="rgba(0,229,255,0.3)" strokeWidth="1.2"/>
            <circle cx="310" cy="100" r="4" fill="rgba(255,255,255,0.6)"/>
            <circle cx="130" cy="80" r="2.5" fill="rgba(255,255,255,0.5)"/>
            <circle cx="270" cy="175" r="1.5" fill="rgba(255,255,255,0.4)"/>
            <circle cx="150" cy="165" r="2" fill="rgba(255,255,255,0.5)"/>
            <circle cx="290" cy="120" r="22" fill="rgba(180,60,40,0.2)" stroke="rgba(229,57,53,0.3)" strokeWidth="0.7"/>
            <text x="290" y="126" textAnchor="middle" fill="rgba(229,57,53,0.7)" fontSize="7" fontFamily="Orbitron">MARS</text>
            <circle cx="140" cy="155" r="10" fill="rgba(0,100,180,0.2)" stroke="rgba(0,229,255,0.3)" strokeWidth="0.5"/>
            <text x="140" y="159" textAnchor="middle" fill="rgba(0,229,255,0.6)" fontSize="5.5" fontFamily="Orbitron">EARTH</text>
            <text x="210" y="195" textAnchor="middle" fill="rgba(229,57,53,0.5)" fontSize="10" fontFamily="Orbitron">⚠ EMERGENCY MODE ⚠</text>
            <rect x="40" y="248" width="140" height="170" rx="4" fill="rgba(229,57,53,0.04)" stroke="rgba(229,57,53,0.15)" strokeWidth="0.7"/>
            <text x="110" y="265" textAnchor="middle" fill="#e53935" fontSize="7" fontFamily="Share Tech Mono" letterSpacing="2">SYSTEMS</text>
            {[
              { lbl:"NAVIGATION", val:20, vy:285, by:289, bw:24, c:"#e53935" },
              { lbl:"POWER",      val:30, vy:304, by:308, bw:35, c:"#ffb300" },
              { lbl:"COMMS",      val:14, vy:323, by:327, bw:16, c:"#e53935" },
              { lbl:"LIFE-SUPP",  val:39, vy:342, by:346, bw:45, c:"#e53935" },
              { lbl:"ENGINE",     val:8,  vy:361, by:365, bw:10, c:"#e53935" },
            ].map(s => (
              <g key={s.lbl}>
                <text x="52" y={s.vy} fill="rgba(255,255,255,0.7)" fontSize="7.5" fontFamily="Share Tech Mono">{s.lbl}</text>
                <rect x="52" y={s.by} width="116" height="3" rx="1.5" fill="rgba(255,255,255,0.06)"/>
                <rect x="52" y={s.by} width={s.bw} height="3" rx="1.5" fill={s.c}/>
                <text x="170" y={s.vy} textAnchor="end" fill={s.c} fontSize="7" fontFamily="Share Tech Mono">{s.val}%</text>
              </g>
            ))}
            <text x="110" y="400" textAnchor="middle" fill="rgba(229,57,53,0.6)" fontSize="7" fontFamily="Share Tech Mono" letterSpacing="1">CRITICAL — REPAIR REQUIRED</text>
            <rect x="240" y="248" width="160" height="170" rx="4" fill="rgba(0,229,255,0.03)" stroke="rgba(0,229,255,0.12)" strokeWidth="0.7"/>
            <text x="320" y="265" textAnchor="middle" fill="rgba(0,229,255,0.7)" fontSize="7" fontFamily="Share Tech Mono" letterSpacing="2">AI COPILOT</text>
            <rect x="255" y="275" width="130" height="50" rx="3" fill="rgba(0,229,255,0.04)" stroke="rgba(0,229,255,0.1)" strokeWidth="0.5"/>
            <text x="320" y="292" textAnchor="middle" fill="rgba(0,229,255,0.8)" fontSize="7" fontFamily="Share Tech Mono">STATUS: PARTIALLY</text>
            <text x="320" y="305" textAnchor="middle" fill="rgba(0,229,255,0.8)" fontSize="7" fontFamily="Share Tech Mono">ONLINE</text>
            <text x="320" y="316" textAnchor="middle" fill="rgba(255,179,0,0.6)" fontSize="7" fontFamily="Share Tech Mono">AWAITING INPUT...</text>
            <rect x="255" y="362" width="130" height="40" rx="3" fill="rgba(229,57,53,0.08)" stroke="rgba(229,57,53,0.2)" strokeWidth="0.7"/>
            <text x="320" y="376" textAnchor="middle" fill="rgba(229,57,53,0.6)" fontSize="6.5" fontFamily="Share Tech Mono" letterSpacing="1.5">MISSION TIMER</text>
            <text x="320" y="394" textAnchor="middle" fill="#e53935" fontSize="14" fontFamily="Orbitron" fontWeight="700">14:37</text>
            <rect x="20" y="436" width="380" height="24" rx="0" fill="rgba(229,57,53,0.05)" stroke="rgba(229,57,53,0.1)" strokeWidth="0.5"/>
            <text x="40"  y="452" fill="rgba(229,57,53,0.7)" fontSize="7" fontFamily="Share Tech Mono">ALTITUDE: 384,000 KM</text>
            <text x="210" y="452" textAnchor="middle" fill="rgba(255,179,0,0.7)" fontSize="7" fontFamily="Share Tech Mono">⚠ 5 SYSTEMS OFFLINE</text>
            <text x="380" y="452" textAnchor="end" fill="rgba(0,229,255,0.7)" fontSize="7" fontFamily="Share Tech Mono">HEADING: EARTH</text>
          </svg>
        </div>
      </div>
    </div>
    <style>{`.story-layout{@media(max-width:900px){grid-template-columns:1fr!important;gap:3rem!important}}`}</style>
  </section>
);
export default StorySection;
