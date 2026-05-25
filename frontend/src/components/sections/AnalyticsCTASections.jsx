import { useEffect, useRef, useState } from "react";
import { SectionHeader, Button, HUDTag } from "../ui/UIKit";

/**
 * AnalyticsSection — Performance tracking showcase.
 * CTASection — Final mission launch call to action.
 */

// ── Analytics ─────────────────────────────────────────────────────────────────

const SUBJECT_STATS = [
  { subject: "MATH", score: 90, time: "2:34", accuracy: "9/10", status: "STRONG", statusColor: "#4caf50" },
  { subject: "CS", score: 80, time: "3:10", accuracy: "8/10", status: "STRONG", statusColor: "#4caf50" },
  { subject: "PHYSICS", score: 40, time: "5:22", accuracy: "4/10", status: "WEAK", statusColor: "#e53935" },
  { subject: "CHEMISTRY", score: 60, time: "3:48", accuracy: "6/10", status: "AVERAGE", statusColor: "#ffc107" },
  { subject: "GEN KNO", score: 70, time: "2:06", accuracy: "7/10", status: "GOOD", statusColor: "#26c6da" },
];

const AnalyticsBar = ({ stat, index, started }) => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!started) return;
    const t = setTimeout(() => setWidth(stat.score), 400 + index * 120);
    return () => clearTimeout(t);
  }, [started, stat.score, index]);

  const barColor =
    stat.score >= 80 ? "#4caf50" :
    stat.score >= 60 ? "#ffc107" : "#e53935";

  return (
    <div style={{ marginBottom: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span
            className="font-mono"
            style={{ fontSize: "0.68rem", color: "var(--grey-200)", letterSpacing: "0.1em", width: 70 }}
          >
            {stat.subject}
          </span>
          <span
            className="font-mono"
            style={{
              fontSize: "0.58rem",
              color: stat.statusColor,
              background: stat.statusColor + "15",
              border: `1px solid ${stat.statusColor}33`,
              borderRadius: 2,
              padding: "1px 6px",
              letterSpacing: "0.1em",
            }}
          >
            {stat.status}
          </span>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <span className="font-mono" style={{ fontSize: "0.65rem", color: "var(--grey-400)" }}>⏱ {stat.time}</span>
          <span className="font-mono" style={{ fontSize: "0.65rem", color: barColor }}>{stat.accuracy}</span>
        </div>
      </div>
      <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${width}%`,
            background: `linear-gradient(90deg, ${barColor}88, ${barColor})`,
            borderRadius: 3,
            boxShadow: `0 0 8px ${barColor}55`,
            transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </div>
    </div>
  );
};

export const AnalyticsSection = () => {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.25 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="analytics" style={{ position: "relative", zIndex: 10, padding: "6rem 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem" }}>
        <SectionHeader
          tag="MISSION DEBRIEF"
          title="TRACK EVERY"
          highlight="WEAKNESS"
          subtitle="After each level, the AI generates a full performance report. Know exactly where you're strong, and which systems need urgent repair."
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "3rem",
            alignItems: "start",
          }}
          className="analytics-layout"
          ref={ref}
        >
          {/* Left: bar chart */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid rgba(229,57,53,0.15)",
              borderRadius: 8,
              padding: "1.75rem",
            }}
          >
            <div
              className="font-mono"
              style={{ fontSize: "0.62rem", color: "var(--red-400)", letterSpacing: "0.15em", marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <span>◈ SUBJECT ACCURACY REPORT</span>
              <span style={{ color: "var(--grey-400)" }}>LEVEL 2 · ATTEMPT 1</span>
            </div>
            {SUBJECT_STATS.map((s, i) => (
              <AnalyticsBar key={s.subject} stat={s} index={i} started={started} />
            ))}
          </div>

          {/* Right: AI insight card + metrics */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {/* AI insight */}
            <div
              style={{
                background: "var(--red-subtle)",
                border: "1px solid rgba(229,57,53,0.2)",
                borderRadius: 8,
                padding: "1.5rem",
              }}
            >
              <div
                className="font-mono"
                style={{ fontSize: "0.62rem", color: "var(--red-400)", letterSpacing: "0.15em", marginBottom: "1rem" }}
              >
                🤖 AI PERFORMANCE ANALYSIS
              </div>
              <p
                className="font-body"
                style={{ fontSize: "0.88rem", color: "var(--grey-200)", lineHeight: 1.7, fontStyle: "italic" }}
              >
                "Cadet, you're strong in Math and Computer Science. Your Physics performance is critical — especially motion and Newton's Laws. Focus your next mission on Physics: motion, force, and energy concepts."
              </p>
              <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <span className="font-mono" style={{ fontSize: "0.62rem", color: "#4caf50", background: "#4caf5015", border: "1px solid #4caf5033", borderRadius: 2, padding: "2px 8px" }}>
                  ✓ Math: Excellent
                </span>
                <span className="font-mono" style={{ fontSize: "0.62rem", color: "#e53935", background: "#e5393515", border: "1px solid #e5393533", borderRadius: 2, padding: "2px 8px" }}>
                  ⚠ Physics: Needs Work
                </span>
              </div>
            </div>

            {/* Metric cards */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              {[
                { label: "TOTAL TIME", value: "11:42", icon: "⏱" },
                { label: "HINTS USED", value: "3", icon: "💡" },
                { label: "FINAL SCORE", value: "26/30", icon: "🎯" },
                { label: "LEVEL STATUS", value: "PASSED", icon: "✓" },
              ].map((m) => (
                <div
                  key={m.label}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: 6,
                    padding: "1rem",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "1.3rem", marginBottom: "0.3rem" }}>{m.icon}</div>
                  <div
                    className="font-display"
                    style={{ fontSize: "1.1rem", fontWeight: 700, color: "var(--white)", letterSpacing: "0.04em" }}
                  >
                    {m.value}
                  </div>
                  <div
                    className="font-mono"
                    style={{ fontSize: "0.58rem", color: "var(--grey-400)", letterSpacing: "0.12em", marginTop: 2, textTransform: "uppercase" }}
                  >
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .analytics-layout { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
};

// ── CTA Section ───────────────────────────────────────────────────────────────

export const CTASection = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="cta"
      ref={ref}
      style={{ position: "relative", zIndex: 10, padding: "6rem 0 4rem" }}
    >
      {/* Background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 70% 80% at 50% 50%, rgba(229,57,53,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: "0 1.5rem",
          textAlign: "center",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "all 0.7s ease",
        }}
      >
        {/* Alert strip */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.4rem 1.2rem",
            background: "rgba(229,57,53,0.08)",
            border: "1px solid rgba(229,57,53,0.25)",
            borderRadius: 2,
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--red-400)",
              animation: "pulse-red 1.5s ease-in-out infinite",
            }}
          />
          <span className="font-mono" style={{ fontSize: "0.65rem", color: "var(--red-400)", letterSpacing: "0.15em" }}>
            MISSION AWAITS · LAUNCH SEQUENCE READY
          </span>
        </div>

        <h2
          className="font-display"
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: "0.01em",
            textTransform: "uppercase",
            color: "var(--white)",
            marginBottom: "1.25rem",
          }}
        >
          READY TO FIX
          <br />
          <span className="gradient-text-red">YOUR SPACECRAFT?</span>
        </h2>

        <p
          className="font-body"
          style={{ fontSize: "1.05rem", color: "var(--grey-300)", maxWidth: 520, margin: "0 auto 2.5rem", lineHeight: 1.7 }}
        >
          The clock is ticking. 5 levels. 5 subjects. Your STEM knowledge is the only tool that matters. Can you get home?
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          <Button variant="primary" size="lg" href="#">
            🚀 LAUNCH MISSION NOW
          </Button>
          <Button variant="secondary" href="#how-it-works">
            WATCH BRIEFING
          </Button>
        </div>

        {/* Trust signals */}
        <div
          style={{
            marginTop: "3rem",
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            flexWrap: "wrap",
          }}
        >
          {[
            { icon: "🔒", label: "Secure Login" },
            { icon: "🎓", label: "School Ready" },
            { icon: "🤖", label: "AI Powered" },
            { icon: "♾️", label: "Infinite Retry" },
          ].map((t) => (
            <div key={t.label} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <span style={{ fontSize: "0.9rem" }}>{t.icon}</span>
              <span className="font-mono" style={{ fontSize: "0.65rem", color: "var(--grey-400)", letterSpacing: "0.08em" }}>
                {t.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
