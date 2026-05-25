import { useEffect, useRef, useState } from "react";
import { SectionHeader } from "../ui/UIKit";

/**
 * SubjectsSection — 5 STEM subject blocks with animated radar-style display.
 */

const SUBJECTS = [
  {
    id: "MATH",
    icon: "∑",
    label: "Mathematics",
    desc: "Algebra, geometry, arithmetic, ratios, and logic puzzles. Numbers are your weapons.",
    topics: ["Algebra", "Geometry", "Fractions", "Logic", "Statistics"],
    questions: "3 per level",
    difficulty: "All levels",
    color: "var(--red-400)",
    bg: "var(--red-subtle)",
  },
  {
    id: "CS",
    icon: "</>",
    label: "Computer Science",
    desc: "Binary logic, algorithms, data structures, and computational thinking challenges.",
    topics: ["Algorithms", "Binary", "Data Structures", "Logic Gates", "Coding"],
    questions: "3 per level",
    difficulty: "All levels",
    color: "var(--cyan-400)",
    bg: "rgba(38,198,218,0.06)",
  },
  {
    id: "PHY",
    icon: "⚡",
    label: "Physics",
    desc: "Forces, motion, energy, waves, and the laws that govern the universe — and your spacecraft.",
    topics: ["Newton's Laws", "Energy", "Waves", "Electricity", "Motion"],
    questions: "3 per level",
    difficulty: "All levels",
    color: "var(--red-400)",
    bg: "var(--red-subtle)",
  },
  {
    id: "CHEM",
    icon: "⚗️",
    label: "Chemistry",
    desc: "Elements, reactions, bonds, and the periodic table. The fuel in your engines runs on this.",
    topics: ["Periodic Table", "Bonds", "Reactions", "Acids/Bases", "States"],
    questions: "3 per level",
    difficulty: "All levels",
    color: "var(--cyan-400)",
    bg: "rgba(38,198,218,0.06)",
  },
  {
    id: "GK",
    icon: "🌐",
    label: "General Knowledge",
    desc: "Science trivia, space facts, world records, and everything your brain should know.",
    topics: ["Space Facts", "Science Trivia", "World Records", "Inventions", "Nature"],
    questions: "3 per level",
    difficulty: "All levels",
    color: "var(--red-400)",
    bg: "var(--red-subtle)",
  },
];

const SubjectCard = ({ subject, index }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onClick={() => setExpanded(!expanded)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-20px)",
        transition: `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s, border-color 0.3s, background 0.3s`,
        background: expanded ? "#15181e" : "var(--bg-card)",
        border: `1px solid ${expanded ? subject.color + "44" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 6,
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      {/* Header row */}
      <div
        style={{
          padding: "1.25rem 1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        {/* Subject badge */}
        <div
          style={{
            width: 50,
            height: 50,
            background: subject.bg,
            border: `1px solid ${subject.color}33`,
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "var(--font-mono)",
            fontSize: "1.1rem",
            color: subject.color,
            flexShrink: 0,
            fontWeight: 700,
          }}
        >
          {subject.icon}
        </div>

        <div style={{ flex: 1 }}>
          <div
            className="font-mono"
            style={{ fontSize: "0.6rem", color: subject.color, letterSpacing: "0.15em", marginBottom: 3 }}
          >
            SYS-{subject.id} · {subject.questions}
          </div>
          <h3
            className="font-heading"
            style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--white)", letterSpacing: "0.04em", textTransform: "uppercase" }}
          >
            {subject.label}
          </h3>
        </div>

        {/* Expand indicator */}
        <div
          style={{
            color: subject.color,
            fontSize: "0.75rem",
            fontFamily: "var(--font-mono)",
            transition: "transform 0.3s ease",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          ▼
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: "rgba(255,255,255,0.05)", marginBottom: 0 }}>
        {visible && (
          <div
            style={{
              height: "100%",
              width: "100%",
              background: `linear-gradient(90deg, ${subject.color}66, ${subject.color})`,
              transformOrigin: "left",
              animation: `scaleX-in 1.2s ease ${0.5 + index * 0.1}s both`,
            }}
          />
        )}
      </div>

      {/* Expanded detail */}
      <div
        style={{
          maxHeight: expanded ? 200 : 0,
          overflow: "hidden",
          transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div style={{ padding: "0 1.5rem 1.5rem" }}>
          <p
            className="font-body"
            style={{ fontSize: "0.875rem", color: "var(--grey-300)", lineHeight: 1.65, marginBottom: "1rem" }}
          >
            {subject.desc}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {subject.topics.map((t) => (
              <span
                key={t}
                className="font-mono"
                style={{
                  fontSize: "0.65rem",
                  padding: "3px 10px",
                  background: subject.bg,
                  border: `1px solid ${subject.color}22`,
                  borderRadius: 2,
                  color: subject.color,
                  letterSpacing: "0.08em",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SubjectsSection = () => (
  <section id="subjects" style={{ position: "relative", zIndex: 10, padding: "6rem 0" }}>
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "4rem",
          alignItems: "start",
        }}
        className="subjects-layout"
      >
        {/* Left: header + context */}
        <div>
          <SectionHeader
            tag="STEM MODULES"
            title="5 SUBJECTS."
            highlight="ONE SHIP."
            subtitle="Your spacecraft has 5 critical systems. Each one maps to a STEM subject. All must be repaired. Tap any subject to see what awaits."
            center={false}
          />

          {/* Mission breakdown */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid rgba(229,57,53,0.15)",
              borderRadius: 6,
              padding: "1.5rem",
              marginTop: "2rem",
            }}
          >
            <div
              className="font-mono"
              style={{ fontSize: "0.62rem", color: "var(--red-400)", letterSpacing: "0.15em", marginBottom: "1rem" }}
            >
              ◈ LEVEL BREAKDOWN
            </div>
            {[
              { label: "LEVELS 1–2", tag: "EASY", color: "#4caf50" },
              { label: "LEVELS 3–4", tag: "MEDIUM", color: "#ffc107" },
              { label: "LEVEL 5", tag: "HARD", color: "#e53935" },
            ].map((r) => (
              <div
                key={r.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.5rem 0",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}
              >
                <span className="font-heading" style={{ fontSize: "0.85rem", color: "var(--grey-200)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {r.label}
                </span>
                <span
                  className="font-mono"
                  style={{
                    fontSize: "0.62rem",
                    color: r.color,
                    background: r.color + "18",
                    border: `1px solid ${r.color}44`,
                    borderRadius: 2,
                    padding: "2px 8px",
                    letterSpacing: "0.1em",
                  }}
                >
                  {r.tag}
                </span>
              </div>
            ))}
            <p
              className="font-mono"
              style={{ fontSize: "0.68rem", color: "var(--grey-400)", marginTop: "0.75rem", letterSpacing: "0.04em" }}
            >
              3 questions × 5 subjects = 15 per level · 250+ question pool · randomized every session
            </p>
          </div>
        </div>

        {/* Right: subject cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {SUBJECTS.map((s, i) => (
            <SubjectCard key={s.id} subject={s} index={i} />
          ))}
        </div>
      </div>
    </div>

    <style>{`
      @keyframes scaleX-in {
        from { transform: scaleX(0); }
        to { transform: scaleX(1); }
      }
      @media (max-width: 900px) {
        .subjects-layout {
          grid-template-columns: 1fr !important;
          gap: 2rem !important;
        }
      }
    `}</style>
  </section>
);

export default SubjectsSection;