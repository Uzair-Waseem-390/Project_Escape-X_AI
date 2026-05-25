import { useEffect, useRef, useState } from "react";
import { SectionHeader } from "../ui/UIKit";

/**
 * HowItWorksSection — Mission briefing, step by step.
 * Uses Intersection Observer for scroll-triggered reveals.
 */

const STEPS = [
  {
    id: "01",
    icon: "🔐",
    title: "Report for Duty",
    desc: "Login to Mission Control. Your crew record, mission history, and performance dossier are waiting.",
    detail: "Secure Django authentication. Your progress is saved across every session.",
    color: "var(--cyan-400)",
  },
  {
    id: "02",
    icon: "🛸",
    title: "Board the Station",
    desc: "You're adrift. The spacecraft AI confirms critical damage across 5 systems. Mission timer: 15 minutes.",
    detail: "5 levels of increasing difficulty. Each level has 15 STEM questions across 5 subjects.",
    color: "var(--red-400)",
  },
  {
    id: "03",
    icon: "🧩",
    title: "Solve to Repair",
    desc: "Answer STEM questions correctly to patch each damaged system. Every right answer powers the ship back up.",
    detail: "+2 points correct, -2 points wrong. Score ≥26/30 to clear the level (max 2 mistakes allowed).",
    color: "var(--red-400)",
  },
  {
    id: "04",
    icon: "🤖",
    title: "AI Copilot Assists",
    desc: "Stuck on a question? Your AI copilot gives hints, step-by-step explanations, and relevant YouTube resources.",
    detail: "LangGraph multi-agent system: Intent detection → Knowledge generation → Teaching layer → Video tools.",
    color: "var(--cyan-400)",
  },
  {
    id: "05",
    icon: "📡",
    title: "Mission Debrief",
    desc: "After each level, the AI analyzes your performance — strengths, weaknesses, and how to improve.",
    detail: "Subject-wise accuracy, time tracking, hint usage, and personalized improvement roadmap.",
    color: "var(--red-400)",
  },
  {
    id: "06",
    icon: "🏠",
    title: "Get Home",
    desc: "Clear all 5 levels. Fully repair the spacecraft. Blast through the atmosphere and land safely.",
    detail: "Retry any level anytime. New random questions each attempt. Infinite replayability.",
    color: "var(--cyan-400)",
  },
];

const StepCard = ({ step, index }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

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
      style={{
        display: "flex",
        gap: "1.5rem",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.55s ease ${index * 0.12}s, transform 0.55s ease ${index * 0.12}s`,
        position: "relative",
      }}
    >
      {/* Left column: number + connector line */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
        <div
          style={{
            width: 48,
            height: 48,
            background: "var(--bg-card)",
            border: `1px solid ${step.color}44`,
            borderRadius: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            position: "relative",
          }}
        >
          <span style={{ fontSize: "1.4rem" }}>{step.icon}</span>
          {/* Step number badge */}
          <span
            className="font-mono"
            style={{
              position: "absolute",
              top: -8,
              right: -8,
              background: step.color === "var(--red-400)" ? "var(--red-600)" : "rgba(38,198,218,0.15)",
              border: `1px solid ${step.color}`,
              color: step.color,
              fontSize: "0.55rem",
              padding: "1px 5px",
              borderRadius: 2,
              letterSpacing: "0.08em",
            }}
          >
            {step.id}
          </span>
        </div>
        {/* Connector line */}
        {index < STEPS.length - 1 && (
          <div
            style={{
              width: 1,
              flex: 1,
              minHeight: 40,
              background: "linear-gradient(180deg, rgba(229,57,53,0.2), transparent)",
              marginTop: 8,
            }}
          />
        )}
      </div>

      {/* Right: content */}
      <div style={{ paddingBottom: "2rem" }}>
        <h3
          className="font-heading"
          style={{
            fontSize: "1.15rem",
            fontWeight: 700,
            color: "var(--white)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            marginBottom: "0.4rem",
          }}
        >
          {step.title}
        </h3>
        <p
          className="font-body"
          style={{ fontSize: "0.92rem", color: "var(--grey-300)", lineHeight: 1.65, marginBottom: "0.6rem" }}
        >
          {step.desc}
        </p>
        <p
          className="font-mono"
          style={{
            fontSize: "0.72rem",
            color: step.color,
            letterSpacing: "0.04em",
            background: step.color === "var(--red-400)" ? "var(--red-subtle)" : "rgba(38,198,218,0.06)",
            border: `1px solid ${step.color}22`,
            borderRadius: 3,
            padding: "6px 10px",
            display: "inline-block",
          }}
        >
          ↳ {step.detail}
        </p>
      </div>
    </div>
  );
};

const HowItWorksSection = () => (
  <section id="how-it-works" style={{ position: "relative", zIndex: 10, padding: "6rem 0" }}>
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem" }}>
      <SectionHeader
        tag="MISSION BRIEFING"
        title="HOW THE MISSION"
        highlight="WORKS"
        subtitle="Six phases stand between you and home. Master your STEM knowledge to fix each broken system and escape the void."
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0 4rem",
          maxWidth: 960,
          margin: "0 auto",
        }}
        className="steps-grid"
      >
        {STEPS.map((step, i) => (
          <StepCard key={step.id} step={step} index={i} />
        ))}
      </div>
    </div>

    <style>{`
      @media (max-width: 768px) {
        .steps-grid {
          grid-template-columns: 1fr !important;
        }
      }
    `}</style>
  </section>
);

export default HowItWorksSection;
