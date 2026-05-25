import { useEffect, useRef, useState } from "react";
import { SectionHeader } from "../ui/UIKit";

const FEATURES = [
  { icon:"🎮", tag:"GAME ENGINE",    tagC:"var(--red-400)",   tagBg:"var(--red-subtle)",               hi:true,  hiC:"var(--red-500)",  title:"5-Level Story Progression", desc:"Navigate → Power → Comms → Life Support → Engine. Each system must be cleared before the next one unlocks." },
  { icon:"🎲", tag:"QUESTION ENG",   tagC:"var(--cyan-400)",  tagBg:"rgba(0,229,255,.06)",              hi:false,                        title:"Randomised Each Run",       desc:"15 random questions from a 250+ pool. 3 per subject per level. No two missions are identical." },
  { icon:"🤖", tag:"AI SYSTEM",      tagC:"var(--red-400)",   tagBg:"var(--red-subtle)",               hi:true,  hiC:"var(--red-500)",  title:"LangGraph AI Copilot",      desc:"Multi-node agent: intent detection, knowledge generation, teaching layer, YouTube tool, response formatter." },
  { icon:"⏱", tag:"TIMER",          tagC:"var(--amber-400,#ffb300)", tagBg:"rgba(255,179,0,.07)",      hi:false,                        title:"15-Minute Pressure Clock",   desc:"Every repair is timed. Subject-wise tracking reveals exactly where you lose precious minutes." },
  { icon:"📊", tag:"ANALYTICS",      tagC:"var(--cyan-400)",  tagBg:"rgba(0,229,255,.06)",              hi:false,                        title:"Post-Mission Debrief",       desc:"Full subject accuracy, time spent, hint usage, and AI-generated strengths and improvement roadmap." },
  { icon:"🔁", tag:"RETRY SYSTEM",   tagC:"var(--red-400)",   tagBg:"var(--red-subtle)",               hi:false,                        title:"Infinite Retry",             desc:"Failed a level? Retry with a fresh random question set. Every attempt is its own learning session." },
  { icon:"🎥", tag:"VIDEO INTEL",    tagC:"var(--amber-400,#ffb300)", tagBg:"rgba(255,179,0,.07)",      hi:false,                        title:"YouTube Learning Links",     desc:"AI searches YouTube for the exact topic you're struggling with and surfaces the most relevant video." },
  { icon:"🏆", tag:"SCORING",        tagC:"var(--cyan-400)",  tagBg:"rgba(0,229,255,.06)",              hi:false,                        title:"+2 / −2 Scoring System",    desc:"Correct answers restore ship power. Wrong answers drain it. Score ≥26/30 to advance the repair." },
];

const FeatureCard = ({ feat, index }) => {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  const [hov, setHov] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold:.1 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ opacity: vis?1:0, transform: vis?"translateY(0)":"translateY(22px)", transition:`opacity .5s ease ${index*.065}s,transform .5s ease ${index*.065}s,border-color .3s,background .3s,box-shadow .3s`,
        background: hov?"var(--bg-card-hover,#141920)":"var(--bg-card)", border:`1px solid ${hov?"rgba(229,57,53,.3)":"rgba(255,255,255,.05)"}`,
        borderRadius:6, padding:"1.4rem 1.3rem", position:"relative", overflow:"hidden",
        boxShadow: hov?"0 6px 28px rgba(0,0,0,.4)":"var(--shadow-card)", cursor:"default" }}>
      {feat.hi && <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${feat.hiC},transparent)` }} />}
      <span className="font-mono" style={{ fontSize:".57rem", letterSpacing:".14em", textTransform:"uppercase", padding:"2px 8px", borderRadius:2, border:`1px solid ${feat.tagC}33`, color:feat.tagC, background:feat.tagBg, display:"inline-block", marginBottom:".9rem" }}>{feat.tag}</span>
      <div className="font-body" style={{ fontSize:"1.6rem", marginBottom:".6rem" }}>{feat.icon}</div>
      <h3 className="font-display" style={{ fontSize:".95rem", fontWeight:700, textTransform:"uppercase", letterSpacing:".04em", color:"var(--white)", marginBottom:".55rem", lineHeight:1.3 }}>{feat.title}</h3>
      <p className="font-body" style={{ fontSize:".84rem", color:"var(--grey-300)", lineHeight:1.65 }}>{feat.desc}</p>
    </div>
  );
};

const FeaturesSection = () => (
  <section id="features" style={{ position:"relative", zIndex:10, padding:"6rem 0" }}>
    <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 1.75rem" }}>
      <SectionHeader tag="SHIP CAPABILITIES" title="EVERYTHING" highlight="ONBOARD"
        subtitle="Every system your spacecraft runs on. All engineered for one mission — getting you from Mars back to Earth alive, smarter, and with the samples intact." />
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:".9rem" }} className="feat-grid">
        {FEATURES.map((f, i) => <FeatureCard key={f.title} feat={f} index={i} />)}
      </div>
    </div>
    <style>{`
      @media(max-width:1200px){.feat-grid{grid-template-columns:repeat(3,1fr)!important}}
      @media(max-width:900px){.feat-grid{grid-template-columns:repeat(2,1fr)!important}}
      @media(max-width:540px){.feat-grid{grid-template-columns:1fr!important}}
    `}</style>
  </section>
);
export default FeaturesSection;
