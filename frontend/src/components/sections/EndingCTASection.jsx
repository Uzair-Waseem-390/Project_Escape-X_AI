import { useEffect, useRef, useState } from "react";
import { Button, HUDTag } from "../ui/UIKit";

const SYSTEMS = [
  { s:"Navigation System",  l:"Level 1", c:"#22c55e" },
  { s:"Power Distribution", l:"Level 2", c:"#4ade80" },
  { s:"Communication Array",l:"Level 3", c:"#f59e0b" },
  { s:"Life Support",       l:"Level 4", c:"#f97316" },
  { s:"Engine Core",        l:"Level 5", c:"#e53935" },
];

const EndingCTASection = () => {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold:.3 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <section id="ending" style={{ position:"relative", zIndex:10, padding:"6rem 0" }}>
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 80% 60% at 50% 50%,rgba(0,230,118,.04),rgba(0,229,255,.03) 40%,transparent 70%)", pointerEvents:"none" }} />

      {/* Earth landing visual */}
      <div style={{ display:"flex", justifyContent:"center", marginBottom:"3rem" }}>
        <svg viewBox="0 0 500 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ maxWidth:500 }}>
          <circle cx="60"  cy="30"  r="1.2" fill="rgba(255,255,255,.5)"/>
          <circle cx="440" cy="50"  r="1"   fill="rgba(255,255,255,.4)"/>
          <circle cx="120" cy="80"  r=".8"  fill="rgba(255,255,255,.4)"/>
          <circle cx="380" cy="25"  r="1.2" fill="rgba(255,255,255,.5)"/>
          <circle cx="250" cy="15"  r=".7"  fill="rgba(255,255,255,.4)"/>
          <ellipse cx="250" cy="300" r="180" ry="100" fill="rgba(0,80,160,0.12)" stroke="rgba(0,229,255,0.25)" strokeWidth="0.8"/>
          <ellipse cx="250" cy="300" r="150" ry="80"  fill="rgba(0,120,80,0.1)"  stroke="rgba(0,200,150,0.15)" strokeWidth="0.5"/>
          <text x="250" y="225" textAnchor="middle" fill="rgba(0,229,255,0.8)" fontSize="12" fontFamily="Orbitron" fontWeight="600" letterSpacing="4">E A R T H</text>
          <text x="250" y="208" textAnchor="middle" fill="rgba(0,229,255,0.4)" fontSize="7.5" fontFamily="Share Tech Mono" letterSpacing="2">LANDING SEQUENCE ACTIVE</text>
          <g transform="translate(180,110) scale(0.55)">
            <ellipse cx="80" cy="30" rx="70" ry="20" fill="rgba(20,25,32,.95)" stroke="rgba(0,229,255,.5)" strokeWidth="1"/>
            <ellipse cx="80" cy="22" rx="22" ry="12" fill="rgba(0,229,255,.08)" stroke="rgba(0,229,255,.4)" strokeWidth=".8"/>
            <ellipse cx="80" cy="48" rx="50" ry="12" fill="rgba(255,100,30,.15)"/>
            <path d="M30 40 Q80 80 130 40" stroke="rgba(255,150,50,.4)" strokeWidth="2" fill="none"/>
          </g>
          <path d="M250 50 L250 190" stroke="rgba(0,230,118,.25)" strokeWidth="1.2" strokeDasharray="5,5"/>
          <polygon points="246,192 254,192 250,202" fill="rgba(0,230,118,.4)"/>
          <text x="265" y="130" fill="rgba(0,230,118,.5)" fontSize="7" fontFamily="Share Tech Mono">TRAJECTORY LOCKED ✓</text>
        </svg>
      </div>

      <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 1.75rem" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4rem", alignItems:"center", marginBottom:"4rem" }} className="ending-grid">
          <div>
            <div style={{ marginBottom:"1.2rem" }}>
              <HUDTag color="green">FINAL LEVEL COMPLETE</HUDTag>
            </div>
            <h2 className="font-display" style={{ fontSize:"clamp(1.9rem,3.5vw,3rem)", fontWeight:900, textTransform:"uppercase", lineHeight:1.1, color:"var(--white)", marginBottom:"1.2rem" }}>
              ENGINE RESTORED.<br /><span className="gradient-text-cyan">RE-ENTRY INITIATED.</span>
            </h2>
            <p className="font-body" style={{ fontSize:"1rem", color:"var(--grey-300)", lineHeight:1.8, marginBottom:"1.5rem" }}>
              After five gruelling system repairs — navigation, power, comms, life support, and the engine core — the spacecraft is whole again. Heat shield active. Earth atmosphere in 4 minutes.
            </p>
            <p className="font-body" style={{ fontSize:"1rem", color:"var(--grey-300)", lineHeight:1.8, marginBottom:"1.5rem" }}>
              You did it. The Mars soil samples are safe. Mission Control is cheering. All that stood between disaster and triumph was STEM knowledge — and now you have more of it than when you launched.
            </p>
            <div style={{ background:"rgba(0,230,118,.05)", border:"1px solid rgba(0,230,118,.2)", borderRadius:5, padding:"1.2rem 1.4rem" }}>
              <div className="font-mono" style={{ fontSize:".58rem", color:"var(--green,#00e676)", letterSpacing:".18em", marginBottom:".5rem", display:"flex", alignItems:"center", gap:7 }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:"var(--green,#00e676)" }} />
                MISSION CONTROL — FINAL TRANSMISSION
              </div>
              <p className="font-mono" style={{ fontSize:".84rem", color:"var(--grey-100,#e2e8f0)", lineHeight:1.6 }}>
                "Mission Success: You have safely returned to Earth with the Mars samples. Your STEM skills saved the mission. Welcome home, Cadet."
              </p>
            </div>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
            <p className="font-mono" style={{ fontSize:".6rem", color:"var(--grey-400)", letterSpacing:".16em", marginBottom:".5rem" }}>◈ MISSION COMPLETION STATS</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:".75rem" }}>
              {[{ ico:"🏁", val:"5/5",   lbl:"LEVELS CLEARED" },{ ico:"🎯", val:"75",    lbl:"QUESTIONS" },
                { ico:"🤖", val:"12",    lbl:"AI INTERACTIONS" },{ ico:"⏱", val:"62 MIN", lbl:"TOTAL TIME" }].map(s => (
                <div key={s.lbl} style={{ background:"var(--bg-card)", border:"1px solid rgba(0,230,118,.1)", borderRadius:5, padding:"1rem", textAlign:"center" }}>
                  <div style={{ fontSize:"1.4rem", marginBottom:".3rem" }}>{s.ico}</div>
                  <div className="font-display" style={{ fontSize:"1.15rem", fontWeight:800, color:"var(--white)" }}>{s.val}</div>
                  <div className="font-mono" style={{ fontSize:".56rem", color:"var(--grey-400)", letterSpacing:".12em", marginTop:2 }}>{s.lbl}</div>
                </div>
              ))}
            </div>
            <div style={{ background:"var(--bg-card)", border:"1px solid rgba(0,230,118,.12)", borderRadius:6, padding:"1.4rem" }}>
              <p className="font-mono" style={{ fontSize:".58rem", color:"var(--green,#00e676)", letterSpacing:".15em", marginBottom:"1rem" }}>✓ ALL SYSTEMS REPAIRED</p>
              {SYSTEMS.map(s => (
                <div key={s.s} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:".45rem 0", borderBottom:"1px solid rgba(255,255,255,.04)" }}>
                  <span className="font-body" style={{ fontSize:".86rem", color:"var(--grey-200)" }}>✓ {s.s}</span>
                  <span className="font-mono" style={{ fontSize:".58rem", color:s.c, letterSpacing:".1em" }}>{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div ref={ref} style={{ textAlign:"center", paddingTop:"1rem", opacity: vis?1:0, transform: vis?"translateY(0)":"translateY(24px)", transition:"all .7s ease" }}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:"1.8rem" }}>
            <HUDTag color="amber">YOUR MISSION AWAITS</HUDTag>
          </div>
          <h2 className="font-display" style={{ fontSize:"clamp(2rem,4.5vw,3.6rem)", fontWeight:900, textTransform:"uppercase", lineHeight:1.1, color:"var(--white)", marginBottom:"1.2rem" }}>
            READY TO FIX<br /><span className="gradient-text-red">YOUR SPACECRAFT?</span>
          </h2>
          <p className="font-body" style={{ fontSize:"1.05rem", color:"var(--grey-300)", maxWidth:520, margin:"0 auto 2.5rem", lineHeight:1.8 }}>
            The Mars samples are counting on you. 5 levels. 5 broken systems. 75 STEM challenges. An AI copilot by your side. Can you make it home?
          </p>
          <div style={{ display:"flex", justifyContent:"center", gap:"1.1rem", flexWrap:"wrap" }}>
            <Button variant="primary" size="lg" href="#">🚀 LAUNCH MISSION NOW</Button>
            <Button variant="secondary" href="#levels">VIEW ALL LEVELS</Button>
          </div>
          <div style={{ display:"flex", justifyContent:"center", gap:"2.5rem", flexWrap:"wrap", marginTop:"2.8rem" }}>
            {[{ ico:"🔒", lbl:"Secure Login" },{ ico:"🎓", lbl:"Ages 10–16" },{ ico:"🤖", lbl:"AI Powered" },{ ico:"♾️", lbl:"Infinite Retry" },{ ico:"📊", lbl:"Full Analytics" }].map(t => (
              <div key={t.lbl} style={{ display:"flex", alignItems:"center", gap:".45rem" }}>
                <span style={{ fontSize:".9rem" }}>{t.ico}</span>
                <span className="font-mono" style={{ fontSize:".62rem", color:"var(--grey-400)", letterSpacing:".08em" }}>{t.lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .gradient-text-cyan{background:linear-gradient(135deg,#80deea,#00e5ff 50%,#00b8d4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .hud-tag[data-color="green"]{background:rgba(0,230,118,.06);border-color:rgba(0,230,118,.25);color:#00e676}
        @media(max-width:900px){.ending-grid{grid-template-columns:1fr!important;gap:2.5rem!important}}
      `}</style>
    </section>
  );
};
export default EndingCTASection;
