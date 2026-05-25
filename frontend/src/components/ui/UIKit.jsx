/**
 * UI Primitives — reusable atomic components
 * All styled via theme CSS variables. No hard-coded colors here.
 */

// ── Button ────────────────────────────────────────────────────────────────────
export const Button = ({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  className = "",
  icon,
  ...props
}) => {
  const cls = `${variant === "primary" ? "btn-primary" : "btn-secondary"} ${className}`;
  const sizeStyle = size === "lg" ? { padding: "16px 40px", fontSize: "0.9rem" } : {};

  if (href) {
    return (
      <a href={href} className={cls} style={sizeStyle} {...props}>
        {icon && <span className="btn-icon">{icon}</span>}
        {children}
      </a>
    );
  }
  return (
    <button className={cls} style={sizeStyle} onClick={onClick} {...props}>
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </button>
  );
};

// ── HUD Tag ───────────────────────────────────────────────────────────────────
export const HUDTag = ({ children, color = "red" }) => {
  const style =
    color === "cyan"
      ? {
          background: "rgba(0,188,212,0.07)",
          borderColor: "rgba(38,198,218,0.3)",
          color: "var(--cyan-400)",
        }
      : {};
  return (
    <span className="hud-tag" style={style}>
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: color === "cyan" ? "var(--cyan-400)" : "var(--red-400)",
          display: "inline-block",
          animation: "pulse-red 1.5s ease-in-out infinite",
        }}
      />
      {children}
    </span>
  );
};

// ── Section Header ────────────────────────────────────────────────────────────
export const SectionHeader = ({ tag, title, highlight, subtitle, center = true }) => (
  <div style={{ textAlign: center ? "center" : "left", marginBottom: "3rem" }}>
    {tag && (
      <div style={{ marginBottom: "1rem", display: "flex", justifyContent: center ? "center" : "flex-start" }}>
        <HUDTag>{tag}</HUDTag>
      </div>
    )}
    <h2
      className="font-display"
      style={{
        fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
        fontWeight: 700,
        lineHeight: 1.15,
        letterSpacing: "0.02em",
        color: "var(--white)",
        marginBottom: "1rem",
        textTransform: "uppercase",
      }}
    >
      {title}{" "}
      {highlight && <span className="gradient-text-red">{highlight}</span>}
    </h2>
    {subtitle && (
      <p
        className="font-body"
        style={{
          fontSize: "1.05rem",
          color: "var(--grey-300)",
          maxWidth: 560,
          margin: center ? "0 auto" : "0",
          lineHeight: 1.7,
        }}
      >
        {subtitle}
      </p>
    )}
  </div>
);

// ── Stat Badge ────────────────────────────────────────────────────────────────
export const StatBadge = ({ value, label }) => (
  <div
    style={{
      padding: "1rem 1.5rem",
      background: "var(--bg-card)",
      border: "1px solid rgba(229,57,53,0.15)",
      borderRadius: 4,
      textAlign: "center",
    }}
  >
    <div
      className="font-display gradient-text-red"
      style={{ fontSize: "1.8rem", fontWeight: 800, lineHeight: 1 }}
    >
      {value}
    </div>
    <div
      className="font-mono"
      style={{ fontSize: "0.65rem", color: "var(--grey-400)", letterSpacing: "0.12em", marginTop: 6, textTransform: "uppercase" }}
    >
      {label}
    </div>
  </div>
);

// ── Divider ───────────────────────────────────────────────────────────────────
export const HUDDivider = () => (
  <div style={{ position: "relative", margin: "4rem 0", display: "flex", alignItems: "center", gap: "1rem" }}>
    <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(229,57,53,0.3))" }} />
    <div style={{ width: 8, height: 8, background: "var(--red-500)", transform: "rotate(45deg)", boxShadow: "0 0 12px var(--red-glow)" }} />
    <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(229,57,53,0.3), transparent)" }} />
  </div>
);

// ── Corner Brackets ───────────────────────────────────────────────────────────
export const CornerBrackets = ({ children, className = "" }) => (
  <div style={{ position: "relative", display: "inline-block" }} className={className}>
    {/* TL */}
    <span style={{ position: "absolute", top: -4, left: -4, width: 12, height: 12, borderTop: "2px solid var(--red-400)", borderLeft: "2px solid var(--red-400)" }} />
    {/* TR */}
    <span style={{ position: "absolute", top: -4, right: -4, width: 12, height: 12, borderTop: "2px solid var(--red-400)", borderRight: "2px solid var(--red-400)" }} />
    {/* BL */}
    <span style={{ position: "absolute", bottom: -4, left: -4, width: 12, height: 12, borderBottom: "2px solid var(--red-400)", borderLeft: "2px solid var(--red-400)" }} />
    {/* BR */}
    <span style={{ position: "absolute", bottom: -4, right: -4, width: 12, height: 12, borderBottom: "2px solid var(--red-400)", borderRight: "2px solid var(--red-400)" }} />
    {children}
  </div>
);
