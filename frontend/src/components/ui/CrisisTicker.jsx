/**
 * CrisisTicker — scrolling red alert ticker showing all 5 system failures
 */
const ITEMS = [
  "⚠ NAVIGATION SYSTEM OFFLINE",
  "🔴 POWER DISTRIBUTION FAILING",
  "⚠ COMMUNICATION ARRAY DOWN",
  "🔴 LIFE SUPPORT CRITICAL",
  "⚠ ENGINE CORE UNSTABLE",
  "📡 DISTRESS SIGNAL ACTIVE",
  "⚠ RETURN TO EARTH COMPROMISED",
  "🔴 REPAIR REQUIRED — ALL SYSTEMS",
  "⚠ MARS SAMPLES ONBOARD — PROTECT",
  "📡 AI COPILOT PARTIALLY ONLINE",
];

const CrisisTicker = () => {
  const doubled = [...ITEMS, ...ITEMS];
  return (
    <div style={{ position:"relative", zIndex:10, background:"rgba(229,57,53,.06)", borderTop:"1px solid rgba(229,57,53,.15)", borderBottom:"1px solid rgba(229,57,53,.15)", padding:".6rem 0", overflow:"hidden" }}>
      <div style={{ display:"flex", gap:"4rem", whiteSpace:"nowrap", animation:"ticker-scroll 28s linear infinite" }}>
        {doubled.map((t, i) => (
          <span key={i} style={{ fontFamily:"var(--font-mono)", fontSize:".65rem", color:"var(--red-400)", letterSpacing:".14em", display:"flex", alignItems:"center", gap:".6rem", flexShrink:0 }}>
            <span style={{ color:"rgba(229,57,53,.4)" }}>▷</span>{t}
          </span>
        ))}
      </div>
      <style>{`@keyframes ticker-scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    </div>
  );
};
export default CrisisTicker;
