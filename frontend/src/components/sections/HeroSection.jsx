import { useState, useEffect, useRef } from "react";
import { Button, HUDTag, CornerBrackets } from "../ui/UIKit";

const useTypewriter = (text, speed = 36, delay = 1100) => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    let i = 0;
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        setDisplayed(text.slice(0, i + 1));
        i++;
        if (i >= text.length) { clearInterval(iv); setDone(true); }
      }, speed);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [text, speed, delay]);
  return { displayed, done };
};

const DamageMeter = ({ label, value, delay = 0 }) => {
  const [cur, setCur] = useState(0);
  useEffect(() => { const t = setTimeout(() => setCur(value), 900 + delay); return () => clearTimeout(t); }, [value, delay]);
  const color = value < 40 ? "#e53935" : value < 60 ? "#ffb300" : "#4caf50";
  return (
    <div style={{ marginBottom: ".55rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
        <span className="font-mono" style={{ fontSize: ".6rem", color: "var(--grey-400)", letterSpacing: ".08em", textTransform: "uppercase" }}>{label}</span>
        <span className="font-mono" style={{ fontSize: ".6rem", color }}>{cur}%</span>
      </div>
      <div style={{ height: 3, background: "rgba(255,255,255,.07)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${cur}%`, background: `linear-gradient(90deg,${color}99,${color})`, borderRadius: 2, boxShadow: `0 0 6px ${color}66`, transition: "width 1.3s cubic-bezier(.4,0,.2,1)" }} />
      </div>
    </div>
  );
};

const HeroSection = () => {
  const [visible, setVisible] = useState(false);
  const tw = useTypewriter("CADET — MISSION CONTROL HERE. YOU'RE RETURNING FROM MARS. CRITICAL SYSTEMS HAVE FAILED. FIVE SYSTEMS ARE DOWN. YOUR STEM KNOWLEDGE IS THE ONLY THING THAT CAN BRING YOU HOME.");
  useEffect(() => { const t = setTimeout(() => setVisible(true), 200); return () => clearTimeout(t); }, []);

  return (
    <section id="hero" style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden", paddingTop: 80 }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 100% 60% at 50% -10%,rgba(229,57,53,.07),transparent 60%),radial-gradient(ellipse 60% 40% at 80% 60%,rgba(255,179,0,.04),transparent 60%)", pointerEvents: "none" }} />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "4rem 1.75rem", width: "100%", position: "relative", zIndex: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }} className="hero-grid">
          <div>
            <div style={{ display: "flex", gap: ".75rem", alignItems: "center", flexWrap: "wrap", marginBottom: "1.6rem", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(-14px)", transition: "all .55s ease .15s" }}>
              <HUDTag>⚠ CRITICAL FAILURE — DEEP SPACE</HUDTag>
              <span className="font-mono" style={{ fontSize: ".58rem", color: "var(--grey-400)", letterSpacing: ".12em" }}>MISSION: MRM-2031-ESC</span>
            </div>
            <h1 className="font-display" style={{ fontSize: "clamp(2.6rem,5.5vw,5rem)", fontWeight: 900, lineHeight: 1.02, textTransform: "uppercase", letterSpacing: "-.01em", marginBottom: "1.6rem", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "all .6s ease .3s" }}>
              RETURNING FROM<br />
              <span className="gradient-text-red" style={{ display: "inline-block", animation: "flicker 9s ease-in-out infinite" }}>MARS.</span><br />
              <span style={{ display: "block", fontSize: "clamp(1rem,2vw,1.7rem)", fontWeight: 500, color: "var(--grey-300)", letterSpacing: ".04em", marginTop: ".35rem" }}>YOUR SPACECRAFT IS FALLING APART.</span>
            </h1>
            <div style={{ background: "rgba(229,57,53,.04)", border: "1px solid rgba(229,57,53,.18)", borderRadius: 4, padding: "1.1rem 1.3rem", marginBottom: "2.2rem", maxWidth: 560, opacity: visible ? 1 : 0, transition: "opacity .55s ease .5s" }}>
              <div className="font-mono" style={{ fontSize: ".58rem", color: "var(--red-400)", letterSpacing: ".2em", marginBottom: ".5rem", display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--red-400)", animation: "pulse-red 1.2s infinite", flexShrink: 0 }} />
                INCOMING TRANSMISSION — MISSION CONTROL · EARTH
              </div>
              <p className="font-mono" style={{ fontSize: ".82rem", color: "var(--grey-200)", lineHeight: 1.7, letterSpacing: ".02em", minHeight: "4.2rem" }}>
                {tw.displayed}{!tw.done && <span style={{ animation: "blink-cursor .85s step-end infinite" }}>█</span>}
              </p>
            </div>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2.8rem", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: "all .55s ease .68s" }}>
              <Button variant="primary" size="lg" href="#">🚀 BEGIN MISSION</Button>
              <Button variant="secondary" href="#levels">▶ VIEW ALL LEVELS</Button>
            </div>
            <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", opacity: visible ? 1 : 0, transition: "opacity .55s ease .82s" }}>
              {[{ v: "5", l: "Mission Levels" }, { v: "5", l: "Ship Systems" }, { v: "AI", l: "Copilot Active" }, { v: "15:00", l: "Per Level" }].map(s => (
                <div key={s.l}>
                  <div className="font-display gradient-text-red" style={{ fontSize: "1.5rem", fontWeight: 800, lineHeight: 1, marginBottom: 3 }}>{s.v}</div>
                  <div className="font-mono" style={{ fontSize: ".56rem", color: "var(--grey-400)", letterSpacing: ".14em", textTransform: "uppercase" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Spacecraft visual */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative", opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(24px)", transition: "all .8s ease .4s" }} className="hero-right-panel">
            <div style={{ position: "relative", width: "100%", maxWidth: 520 }}>
              <div style={{ animation: "float 6s ease-in-out infinite" }}>
                <svg viewBox="0 0 500 340" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="420" cy="60" r="28" fill="rgba(180,80,60,0.18)" stroke="rgba(229,57,53,0.3)" strokeWidth="0.8"/>
                  <text x="420" y="64" textAnchor="middle" fill="rgba(229,57,53,0.6)" fontSize="9" fontFamily="Orbitron">MARS</text>
                  <circle cx="80" cy="280" r="14" fill="rgba(0,100,180,0.15)" stroke="rgba(0,229,255,0.25)" strokeWidth="0.6"/>
                  <text x="80" y="300" textAnchor="middle" fill="rgba(0,229,255,0.5)" fontSize="7" fontFamily="Orbitron">EARTH</text>
                  <ellipse cx="250" cy="175" rx="165" ry="50" fill="rgba(20,25,32,0.9)" stroke="#e53935" strokeWidth="1.2"/>
                  <ellipse cx="250" cy="165" rx="165" ry="50" fill="rgba(20,25,32,0.8)" stroke="rgba(229,57,53,0.4)" strokeWidth="0.7"/>
                  <ellipse cx="250" cy="145" rx="55" ry="30" fill="rgba(0,229,255,0.06)" stroke="rgba(0,229,255,0.4)" strokeWidth="1"/>
                  <rect x="60" y="158" width="110" height="12" rx="2" fill="rgba(0,229,255,0.05)" stroke="rgba(0,229,255,0.3)" strokeWidth="0.8"/>
                  <rect x="330" y="158" width="110" height="12" rx="2" fill="rgba(0,229,255,0.05)" stroke="rgba(0,229,255,0.3)" strokeWidth="0.8"/>
                  <rect x="85" y="197" width="65" height="20" rx="10" fill="rgba(229,57,53,0.08)" stroke="rgba(229,57,53,0.3)" strokeWidth="0.8"/>
                  <rect x="350" y="197" width="65" height="20" rx="10" fill="rgba(229,57,53,0.08)" stroke="rgba(229,57,53,0.3)" strokeWidth="0.8"/>
                  <ellipse cx="88" cy="207" rx="5" ry="8" fill="rgba(255,82,82,0.15)" stroke="rgba(255,82,82,0.5)" strokeWidth="0.7"/>
                  <ellipse cx="412" cy="207" rx="5" ry="8" fill="rgba(255,82,82,0.15)" stroke="rgba(255,82,82,0.5)" strokeWidth="0.7"/>
                  <path d="M210 158 L198 143 L207 150 L194 138" stroke="#ff5252" strokeWidth="1.4" opacity="0.9"/>
                  <path d="M295 172 L308 158 L302 165 L314 152" stroke="#ff5252" strokeWidth="1.4" opacity="0.9"/>
                  <text x="228" y="158" fill="#ffb300" fontSize="14">⚠</text>
                  <text x="296" y="186" fill="#ffb300" fontSize="11">⚠</text>
                  <circle cx="195" cy="140" r="1.5" fill="#ff5252" opacity="0.9"/>
                  <circle cx="310" cy="155" r="1" fill="#ff5252" opacity="0.7"/>
                  <path d="M195 145 Q185 135 175 120 Q165 110 155 100" stroke="rgba(229,57,53,0.2)" strokeWidth="3" fill="none" strokeDasharray="4,4"/>
                </svg>
              </div>
              <div style={{ position: "absolute", top: 0, right: "-1rem", width: 200, zIndex: 5 }}>
                <CornerBrackets>
                  <div style={{ background: "rgba(8,10,12,.9)", border: "1px solid rgba(229,57,53,.22)", borderRadius: 5, padding: "1.1rem", backdropFilter: "blur(14px)" }}>
                    <div className="font-mono" style={{ fontSize: ".58rem", color: "var(--red-400)", letterSpacing: ".16em", marginBottom: ".9rem", display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--red-400)", animation: "pulse-red 1.4s infinite", flexShrink: 0 }} />
                      DAMAGE REPORT
                    </div>
                    {[{ l: "NAVIGATION", v: 20 }, { l: "POWER", v: 30 }, { l: "COMMS", v: 14 }, { l: "LIFE-SUPP", v: 39 }, { l: "ENGINE", v: 8 }].map((m, i) => (
                      <DamageMeter key={m.l} label={m.l} value={m.v} delay={i * 170} />
                    ))}
                    <div className="font-mono" style={{ marginTop: ".8rem", fontSize: ".57rem", color: "var(--red-400)", textAlign: "center", animation: "pulse-red 2s ease-in-out infinite" }}>⚠ REPAIR VIA STEM MISSIONS</div>
                  </div>
                </CornerBrackets>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div style={{ position: "absolute", bottom: "2.2rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: ".5rem", opacity: .45, animation: "float 3s ease-in-out infinite", zIndex: 10 }}>
        <span className="font-mono" style={{ fontSize: ".55rem", color: "var(--grey-400)", letterSpacing: ".22em" }}>SCROLL</span>
        <div style={{ width: 1, height: 30, background: "linear-gradient(180deg,var(--red-500),transparent)" }} />
      </div>

      <style>{`
        @media(max-width:900px){ .hero-grid{grid-template-columns:1fr!important} .hero-right-panel{display:none!important} }
        @keyframes blink-cursor{0%,100%{opacity:1}50%{opacity:0}}
      `}</style>
    </section>
  );
};
export default HeroSection;
